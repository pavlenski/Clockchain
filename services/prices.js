const timestamp = require('unix-timestamp');
const globals = require('../utils/globals');
const Server = require('../models/servers');
const Price = require('../models/prices');
const axios = require('axios');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;

const web3 = new Web3(globals.providerURL);
const contract = new web3.eth.Contract(globals.contractABI, globals.contractID)
timestamp.round = true;

let gatheredPrices = [];

async function sendTransaction(averagePrice, estimatedGas) {
    
    const tempPrivateKey = Buffer.from(globals.privateKeyHash, 'hex'); 
    const txCount = await web3.eth.getTransactionCount(globals.walletAddress);
    const data = contract.methods.setEthPrice(averagePrice).encodeABI();
    const txObject = {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(estimatedGas),
        gasPrice: web3.utils.toHex(web3.utils.toWei(globals.gasPrice.toString(), 'gwei')),
        to: globals.contractID,
        data: data,
    }
    
    const tx = new Tx(txObject, {'chain': 'kovan'});
    tx.sign(tempPrivateKey);

    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');

    const txResult = await web3.eth.sendSignedTransaction(raw);
    return txResult;
} 

async function isItMyTurn() {

    const serverDoc = await Server.findOne({ index: 0 });
    return serverDoc.list[serverDoc.next] === globals.serverName
}

async function changeTurn() {

    const serverDoc = await Server.findOne({ index: 0 });
    next = serverDoc.next + 1 >= serverDoc.total ? 0 : serverDoc.next + 1;

    await Server.updateOne(
        { index: 0 },
        { $set: { next, } }
    );
    console.log(`[${globals.serverName} @ ${currentTimePretty()}]: changed turn.`);
}

function currentTimePretty() {
    let now = (timestamp.toDate(timestamp.now()));
    return now.toLocaleTimeString();
}

function calculateAveragePrice() {

    let sum = 0.0;
    gatheredPrices.forEach( item => sum += item );
    let result = sum / gatheredPrices.length;
    return result;
}

function clearGatheredPrices() {
    gatheredPrices = [];
}

module.exports = {
    
    fetchCurrentPrices: async () => {

        const contractPrice = await contract.methods.getPrice().call()
        const { data } = await axios.get(globals.ethereumPriceURL);
        const returnData = {
            status: 200,
            msg: {
                description: `[${globals.serverName}]: current prices`, 
                api_price: data.ethereum.usd,
                contract_price: parseFloat(contractPrice)
            }
        };
        return returnData;

    },

    fetchAndAddNewPrice: async () => {

        /* 
            Not saving prices remotely anymore, now i keep them in memory
            until updateContract is called and can be executed.
        */
       /* 
            Old way of saving prices remotely
       */
        // const currentTime = timestamp.now();
        // let newPrice = Price({
        //     price: data.ethereum.usd,
        //     timestamp: currentTime
        // });
        // const result = await newPrice.save();
        
        /* 
            The old return obj 
        */
        // return { status: 200, msg: `[${globals.serverName} @ ${currentTimePretty()}]: price with id: '${result.id}' successfully created` };

        const { data } = await axios.get(globals.ethereumPriceURL);
        gatheredPrices.push(data.ethereum.usd);
    
        return { status: 200, msg: `[${globals.serverName} @ ${currentTimePretty()}]: price of ethereum (${data.ethereum.usd}) in usd saved` };
    },

    updateContract: async () => {
        
        /* 
            Check if its the servers turn to writeContract 
        */
        const turn = await isItMyTurn();
        if(turn == false) {
            return { status: 200, msg: `[${globals.serverName} @ ${currentTimePretty()}]: not my turn yet.` }
        }

        /* 
            Check if 15 minutes passed since the last writeContract call 
        */
        const lastTimestamp = await contract.methods.getLastSetTimestamp().call();
        const currentTimestamp = timestamp.now();
        if(currentTimestamp - lastTimestamp < globals.fifteenMinutes) {
            return { status: 200, msg: `[${globals.serverName} @ ${currentTimePretty()}]: recently updated.. next call will be possible in ${globals.fifteenMinutes - (currentTimestamp - lastTimestamp)} seconds` }
        }

        /* 
            Balance check
        */

        const balance = await web3.eth.getBalance(globals.walletAddress);
        const balanceInEther = web3.utils.fromWei(balance, 'ether');
        if(balanceInEther < 0.001) {
            await changeTurn();
            axios.post('http://localhost:5000/fund-me', { walletAddress: globals.walletAddress })
            return { status: 200, msg: `[${globals.serverName} @ ${currentTimePretty()}]: not enough funds, changing order..` }
        }

        /* 
            This is the old way of getting the average price from the remote db,
            Now we are calculating the average price from the array in memory (no more than 15 prices will be inside the array)
         
            */
        // (-> DEPRICATED) Check if there is enough data on the db to calculate the average price (<- DEPRICATED)
        // const averagePriceObj = await Price.aggregate([
        //     { $match: { timestamp: { $gt: currentTimestamp - globals.fifteenMinutes } } },
        //     { $group: { _id: null, avgPrice: { $avg: '$price' } } }
        // ]);
        // if(averagePriceObj === undefined || averagePriceObj.length == 0) {
        //     return { status: 404, msg: `[${globals.serverName} @ ${currentTimePretty()}]: insufficient data on db, could not calculate avg price`}
        // }

        /* 
            New way of calculating the averagePrice..
            Since we came to these lines of code it means that the request passed the timestamp check,
            meaning we can safely clear the gatheredPrices array once we calc. the averagePrice
        */
        
       const averagePrice = calculateAveragePrice();
       clearGatheredPrices();

        /* 
            Check if the price jumped or lowered by 2% from the current contract price
        */
        const contractPrice = await contract.methods.getPrice().call();
        if(averagePrice < (contractPrice * 1.02) && averagePrice > (contractPrice * 0.98)) {
            await changeTurn();
            return { status: 200, msg: `[${globals.serverName} @ ${currentTimePretty()}]: average price has not changed more than 2% of the current contract price` }
        }

        /* 
            Send transaction
        */
        const gasEstimate = await contract.methods.setEthPrice(averagePrice).estimateGas({from: globals.walletAddress});
        const txResponse = await sendTransaction(averagePrice, gasEstimate);
        await changeTurn();

        return { status: 200, msg: `[${globals.serverName} @ ${currentTimePretty()}]: successfully created transaction: ${txResponse.transactionHash}` }

    },

    /* 
        (DEPRICATED ->) Since we no longer save prices remotely, we wont be needing this service function (<- DEPRICATED) 
    */
    deleteOldPrices: async () => {

        let currentTime = timestamp.now()
        const result = await Price.deleteMany( { timestamp: { $lt: currentTime - globals.fifteenMinutes } } );
        
        let msg = `[${globals.serverName} @ ${currentTimePretty()}]: successfully deleted ${result.deletedCount} old price(s)`;
        if(result.deletedCount < 1) {
            msg = `[${globals.serverName} @ ${currentTimePretty()}]: all prices are still fresh, none deleted.`
        }
        return { status: 200, msg }
    }

}