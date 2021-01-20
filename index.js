const serverService = require('./services/servers');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const globals = require('./helpers/globals');
const express = require('express');
const logger = require('morgan');

checkArguments();
registerServer();

mongoose.connect('mongodb+srv://pavlenski:1234@databricks.8wutx.mongodb.net/ethereum?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
const prices = require('./routes/prices');

app.use(logger('dev'));
app.use(bodyParser.json());

app.use('/prices', prices);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    const error = app.get('env') == 'development' ? err : {};
    const status = err.status || 500;

    res.status(status).json({
        error: {
            message: error.message
        }
    });
    console.error(err);
});

async function registerServer() {
    try {
        const result = await serverService.registerServer();
        console.log(result.msg);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

function checkArguments() {
    if(process.argv.length < 6) {
        console.error(`${6 - process.argv.length} more argument(s) are required, terminating..`);
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

const PORT = globals.serverPort;
const server = app.listen(PORT, () => console.log(`[${globals.serverName}]: running on port [${PORT}]`));

let connections = [];

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

server.on('connection', connection => {
    connections.push(connection);
    connection.on('close', () => connections = connections.filter(curr => curr !== connection));
});

async function shutDown() {
    
    console.log('\n\nPreparing shutdown..\n');
    setTimeout(() => {
        console.error('\nCould not close connections in time, forcefully shutting down..');
        process.exit(1);
    }, 10000);

    const disconnectResult = await serverService.disconnectServer();
    console.log(disconnectResult.msg);

    server.close(() => {
        console.log('\nConnections closed. Bye\n');
        process.exit(0);
    });

    connections.forEach(curr => curr.end());
    setTimeout(() => connections.forEach(() => curr.destroy()), 3500);
}




