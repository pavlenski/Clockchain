const Price = require('../models/prices');
const axios = require('axios');
const timestamp = require('unix-timestamp');

const ethPriceUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
const fifteenMins = 15 * 60; 
timestamp.round = true;

module.exports = {

    getAllPrices: async (req, res, next) => {

        const prices = await Price.find({});
        res.status(200).json(prices);
    },

    newPrice: async (req, res, next) => {
        
        let currentTime = timestamp.now()
        const newPrice = new Price({ 
            price: req.body.price, 
            timestamp: currentTime 
        });
        const price = await newPrice.save();
        res.status(201).json(price);
    }, 

    freshAvgPrices: async (req, res, next) => {

        let currentTime = timestamp.now();
        let avgPriceObj = await Price.aggregate([
                { $match: { timestamp: { $gt: currentTime - fifteenMins } } },
                { $group: { _id: null, avgPrice: { $avg: '$price' } } }
            ]);
        res.status(200).json(avgPriceObj);
    },

    getCurrentPrice: async (req, res, next) => {

        const { data } = await axios.get(ethPriceUrl);
        res.status(200).json(data.ethereum);
    },

    deleteOldPrices: async (req, res, next) => {

        let currentTime = timestamp.now()
        await Price.deleteMany( { price: { $lt: currentTime - fifteenMins } } )
        res.status(200).json({ msg: 'succesfully deleted old prices' });
    }
};