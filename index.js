const { createTerminus } = require('@godaddy/terminus');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const globals = require('./helpers/globals');
const express = require('express');
const logger = require('morgan');
const http = require('http');

checkArguments();

mongoose.connect('mongodb+srv://pavlenski:1234@databricks.8wutx.mongodb.net/ethereum?retryWrites=true&w=majority', {
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

function checkArguments() {
    if(process.argv.length < 6) {
        console.error(`${6 - process.argv.length} more arguments are required, terminating..`);
        process.exit(1);
    } else if(process.argv.length > 6) {
        console.error(`Too many arguments, you've got ${process.argv.length - 6} extra, terminating..`);
        process.exit(1);
    }
    if(isNaN(process.argv[3])) {
        console.error(`Port has to be a number, ${process.argv[3]} is not a number, terminating..`);
        process.exit(1);    
    }
}

const server = http.createServer(app);

async function disconnect() {
    setTimeout(() => {
        console.log('Disconnected');
    }, 1000);
}

const options = {
    timeout: 5000,
    onSignal: disconnect
}

/* Start the server */
const PORT = globals.serverPort;
server.listen(PORT, () => console.log(`[${globals.serverName}] running on:`, PORT));



