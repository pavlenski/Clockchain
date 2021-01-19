const axios = require('axios');


async function test() {
    const result = await axios.get('http://localhost:3000/prices/update-contract');
    console.log(result);
}


test();