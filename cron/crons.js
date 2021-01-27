const scheduler = require('node-schedule');
const axios = require('axios');

const serversNum = process.argv.length;
checkArguments();

function checkArguments() {
    for(let i = 2 ; i < serversNum ; i ++) {
        if(isNaN(process.argv[i])) {
            console.log(`Arguments must be numbers.. argument ${i - 2} '${process.argv[i]}' is not a number.`);
            console.log('Exiting.');
            process.exit(1);
        }
    }
}

async function addNewPrice() {
    try {
        const result = await axios.post('http://localhost:' + this.port + '/prices/new-price');
        console.log(result.data);
    } catch (error) {
        console.log(error);
        process.exit(1);        
    }
}

async function writeContract() {
    try {
        const result = await axios.post('http://localhost:' + this.port + '/prices/update-contract');
        console.log(result.data);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


for(let i = 2 ; i < serversNum ; i++) {
    scheduler.scheduleJob('* * * * *', addNewPrice.bind({ "port": process.argv[i]}));
    scheduler.scheduleJob('* * * * *', writeContract.bind({ "port": process.argv[i]}));
}