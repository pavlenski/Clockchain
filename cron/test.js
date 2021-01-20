const scheduler = require('node-schedule');
const axios = require('axios');

console.log(`\nStarting cron jobs..\n\n`);

async function addNewPrice(port) {
    try {
        const result = await axios.post('http://localhost:' + port + '/prices/new-price');
        console.log(result.data);
    } catch (error) {
        console.log(error);
        process.exit(1);        
    }
}

async function writeContract(port) {
    try {
        const result = await axios.post('http://localhost:' + port + '/prices/update-contract');
        console.log(result.data);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

let charlieOne = scheduler.scheduleJob('* * * * *', async () => {
    addNewPrice(3000)
});

let bravoOne = scheduler.scheduleJob('* * * * *', async () => {
    addNewPrice(3010);
});

let echoOne = scheduler.scheduleJob('* * * * *', async () => {
    addNewPrice(3020);
});

let charlieTwo = scheduler.scheduleJob('*/16 * * * *', async () => {
    writeContract(3000);
});

let bravoTwo = scheduler.scheduleJob('*/16 * * * *', async () => {
    writeContract(3010);
});

let echoTwo = scheduler.scheduleJob('*/16 * * * *', async () => {
    writeContract(3020);
});

let cleaner = scheduler.scheduleJob('*/30 * * * *', async () => {
    try {
        const result = await axios.delete('http://localhost:3020/prices/clear-db');
        console.log(result.data)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
});
