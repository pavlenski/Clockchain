const express = require('express');
const logger = require('morgan');
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());

const estimateGas = 21004;

const masterAddress = '0x';
const masterPrivateKey = '..';

app.post('/fund-me', async (req, res, next) => {

    try {
        const address = req.body.walletAddress;
        const response = await sendTransaction(address);
        const msg = `status: ${response.status}`;
        res.status(200).json(msg);

    } catch (error) {
        next(error);
    }

});

async function sendTransaction(address) {
    
    const tempPrivateKey = Buffer.from(masterPrivateKey, 'hex'); 
    const txCount = await web3.eth.getTransactionCount(masterAddress);
    const txObject = {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(estimateGas),
        gasPrice: web3.utils.toHex(web3.utils.toWei(globals.gasPrice.toString(), 'gwei')),
        to: address,
        value: web3.utils.toHex(web3.utils.toWei('0.001', 'ether'))
    }
    
    const tx = new Tx(txObject, {'chain': 'kovan'});
    tx.sign(tempPrivateKey);

    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');

    return new Promise((resolve, reject) => {
        web3.eth.sendSignedTransaction(raw)
        .on('confirmation', (confNumber, receipt, latestBlockHash) => {
            resolve(receipt);
        });
    })
} 

const PORT = 5000;
app.listen(PORT, () => console.log(`[${globals.serverName}]: running on port [${PORT}]`));