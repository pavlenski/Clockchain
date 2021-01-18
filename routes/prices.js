const express = require('express');
const router = require('express-promise-router')();

const PricesController = require('../controllers/prices');

router.route('/')
    .get(PricesController.getAllPrices)
    .post(PricesController.newPrice)
    .delete(PricesController.deleteOldPrices);

router.get('/fresh-avg-prices', PricesController.freshAvgPrices);

router.get('/current-price', PricesController.getCurrentPrice)

module.exports = router;