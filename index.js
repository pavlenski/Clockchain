const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const handler = require('./handlers/errors');
const globals = require('./utils/globals');
const express = require('express');
const logger = require('morgan');
const prices = require('./routes/prices');
const utils = require('./utils/utils');

/* Argument passing check and server registration */
utils.checkArguments();
utils.registerServer();

mongoose.connect('mongodb+srv://pavlenski:1234@databricks.8wutx.mongodb.net/ethereum?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const app = express();

/* Middleware */
app.use(logger('dev'));
app.use(bodyParser.json());

/* Setting routes */
app.use('/prices', prices);

/* Error handling */
app.use(handler.errorNotFound);
app.use(handler.errorHandler);

/* Server setup */
const PORT = globals.serverPort;
const server = app.listen(PORT, () => console.log(`[${globals.serverName}]: running on port [${PORT}]`));

let connections = [];

process.on('SIGTERM', utils.shutDown.bind({ "server": server }));
process.on('SIGINT', utils.shutDown.bind({ "server": server }));

server.on('connection', connection => {
    connections.push(connection);
    connection.on('close', () => connections = connections.filter(curr => curr !== connection));
});





