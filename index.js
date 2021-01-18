const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb+srv://pavlenski:1234@databricks.8wutx.mongodb.net/pricetest?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();

const prices = require('./routes/prices');

/* Middlewares */
app.use(logger('dev'));
app.use(bodyParser.json());

/* Routes */
app.use('/prices', prices);

/* Catch 404 Errors and forward them to error handler */
app.use((req, res, next) => {
    console.log('went trough err');
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/* Error handler function */
app.use((err, req, res, next) => {
    console.log('went trough err2');
    const error = app.get('env') == 'development' ? err : {};
    const status = err.status || 500;

    res.status(status).json({
        error: {
            message: error.message
        }
    });
    console.error(err);
});

/* Start the server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on:', PORT));