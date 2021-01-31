/* (DEPCIRATED ->) No longer in use since we save prices in an array (<- DEPCIRATED) */
const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    price: Number,
    timestamp: Number
});

const Prices = mongoose.model("price", priceSchema);
module.exports = Prices; 
