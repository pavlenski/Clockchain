const router = require('express-promise-router')();
const PricesController = require('../controllers/prices');

/* Routes corresponding with each task */
router.post('/new-price', PricesController.newPrice);
router.post('/update-contract', PricesController.updateContract);
router.get('/current-prices', PricesController.getCurrentPrices);


/* In case i want to erase old prices i will request this action */
router.delete('/clear-db', PricesController.deleteOldPrices);

module.exports = router;