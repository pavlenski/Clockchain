const pricesService = require('../services/prices');

module.exports = {

    newPrice: async (req, res, next) => {

        const result = await pricesService.fetchAndAddNewPrice();
        res.status(result.status).json(result.msg);
    }, 

    updateContract: async (req, res, next) => {

        const result = await pricesService.updateContract(); 
        res.status(result.status).json(result.msg);
    },
    
    getCurrentPrices: async (req, res, next) => {

        const result = await pricesService.fetchCurrentPrices();
        res.status(result.status).json(result.msg);
    },

    deleteOldPrices: async (req, res, next) => {

        const result = await pricesService.deleteOldPrices();
        res.status(result.status).json(result.msg);
    }
};