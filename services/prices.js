const globals = require('../helpers/globals');
const timestamp = require('unix-timestamp');
const Price = require('../models/prices');
const axios = require('axios');
const Web3 = require('web3');

const web3 = new Web3(globals.providerURL);
const contract = new web3.eth.Contract(globals.contractABI, globals.contractID)
timestamp.round = true;

const tempAccountFrom = '0x3164aF51a463Bda6C4C6158d9AdCE36EE37A5515';

module.exports = {
    
    fetchCurrentPrices: async () => {

        const contractPrice = await contract.methods.getPrice().call()
        const { data } = await axios.get(globals.ethereumPriceURL);
        const returnData = {
            ethereum: {
                api_price: data.ethereum.usd,
                contract_price: parseFloat(contractPrice)
            }
        };
        return returnData;
    },

    fetchAndAddNewPrice: async () => {
        
        const { data } = await axios.get(globals.ethereumPriceURL);
        const currentTime = timestamp.now();
        let newPrice = Price({
            price: data.ethereum.usd,
            timestamp: currentTime
        });
        const result = await newPrice.save();
        
        return result.id;
    },

    updateContract: async () => {
        
        const lastTimestamp = await contract.methods.getLastSetTimestamp().call();
        const currentTimestamp = timestamp.now();
        if(currentTimestamp - lastTimestamp > globals.fifteenMinutes) {

            const contractPrice = await contract.methods.getPrice().call();
            const averagePriceObj = await Price.aggregate([
                { $match: { timestamp: { $gt: currentTimestamp - globals.fifteenMinutes } } },
                { $group: { _id: null, avgPrice: { $avg: '$price' } } }
            ]);

            if(averagePriceObj === undefined || averagePriceObj.length == 0) {
                return { status: 404, msg: 'insufficient data on db, could not calculate avg price' }
            }

            const averagePrice = Math.floor(averagePriceObj[0].avgPrice);
            if(averagePrice > (contractPrice * 1.02) || averagePrice < (contractPrice * 0.98)) {

                const receipt = await contract.methods.setEthPrice(averagePrice).send({from: tempAccountFrom});
                console.log(receipt);
                // const gasEstimate = await contract.methods.setEthPrice(averagePrice).estimateGas({from: tempAccountFrom});
                // console.log('Estimated gas:', gasEstimate);
                return { status: 200, msg: `successfully sent transaction` }

            } else {

                return { status: 200, msg: `average price has not changed more than 2% of the current contract price` }
            }
        } else {

            return { status: 200, msg: `recently updated.. next call will be possible in ${globals.fifteenMinutes - (currentTimestamp - lastTimestamp)} seconds` }
        }

    }

}