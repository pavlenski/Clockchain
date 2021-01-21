const serverService = require('../services/servers');

async function checkArguments() {

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

async function registerServer() {

    try {
        const result = await serverService.registerServer();
        console.log(result.msg);
        if(result.err) {
            process.exit(1);
        }
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

async function shutDown() {

    console.log('\n\nPreparing shutdown..\n');
    setTimeout(() => {
        console.error('\nCould not close connections in time, forcefully shutting down..');
        process.exit(1);
    }, 10000);

    try {
        const disconnectResult = await serverService.disconnectServer();
        console.log(disconnectResult.msg);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

    this.server.close(() => {
        console.log('\nConnections closed. Bye\n');
        process.exit(0);
    });

    connections.forEach(curr => curr.end());
    setTimeout(() => connections.forEach(() => curr.destroy()), 3500);
}

module.exports = { 
    checkArguments,
    registerServer,
    shutDown
 }
