// const scheduler = require('node-schedule');
// const axios = require('axios');

// async function addNewPrice(port) {
//     try {
//         const result = await axios.post('http://localhost:' + port + '/prices/new-price');
//         console.log(result.data);
//     } catch (error) {
//         console.log(error);
//         process.exit(1);        
//     }
// }

// let charlieOne = scheduler.scheduleJob('* * * * *', async () => {
//     addNewPrice(3000)
// });

// let bravoOne = scheduler.scheduleJob('* * * * *', async () => {
//     addNewPrice(3010);
// });

// let echoOne = scheduler.scheduleJob('* * * * *', async () => {
//     addNewPrice(3020);
// });

// let cleaner = scheduler.scheduleJob('*/30 * * * *', async () => {
//     const result = await axios.delete('http://localhost:3020/prices/clear-db');
//     console.log(result.data)
// });

let a = 'Charlie';
let b = 'Bravo';

console.log(a === b);