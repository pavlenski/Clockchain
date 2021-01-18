const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    price: Number,
    timestamp: Number
});

const Prices = mongoose.model("price", priceSchema);
module.exports = Prices; 
