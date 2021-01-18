const Price = require('../models/prices');
const axios = require('axios');
const timestamp = require('unix-timestamp');
const pricesService = require('../services/prices');

timestamp.round = true;

module.exports = {

    newPrice: async (req, res, next) => {

        const result = await pricesService.fetchAndAddNewPrice();
        res.status(201).json({ msg: `price with id: ${result} successfully created` });
    }, 

    updateContract: async (req, res, next) => {

        const result = await pricesService.updateContract(); 
        res.status(result.status).json(result.msg);
    },
    
    getCurrentPrices: async (req, res, next) => {

        const data = await pricesService.fetchCurrentPrices();
        res.status(200).json(data);
    },


    freshAvgPrices: async (req, res, next) => {

        let currentTime = timestamp.now();
        let avgPriceObj = await Price.aggregate([
                { $match: { timestamp: { $gt: currentTime - fifteenMins } } },
                { $group: { _id: null, avgPrice: { $avg: '$price' } } }
            ]);
        res.status(200).json(avgPriceObj);
    },


    deleteOldPrices: async (req, res, next) => {

        let currentTime = timestamp.now()
        await Price.deleteMany( { price: { $lt: currentTime - fifteenMins } } )
        res.status(200).json({ msg: 'succesfully deleted old prices' });
    }
};