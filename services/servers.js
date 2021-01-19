const Servers = require('../models/servers');
const globals = require('../helpers/globals');

module.exports = {

    createServerDocument: async () => {

        const serverDoc = new Servers({
            index: 0,
            list: [],
            next: 0,
            total: 0
        });
        const result = await serverDoc.save();
        return result
    },

    registerServer: async () => {
        
        try {
            const serverDoc = await Servers.findOne({ index: 0 });
            let servers = serverDoc.list;
            servers.push(globals.serverName);

            await Servers.updateOne(
                { index: 0 },
                { $set: 
                    { 
                        list: servers, 
                        next: serverDoc.next,
                        total: servers.length
                    } 
                }
            );
            return { msg: `[${globals.serverName}]: registered` }    

        } catch (error) {
            console.log(error);
        }
    },

    disconnectServer: async () => {

        try {
            const serverDoc = await Servers.findOne({ index: 0 });
            let servers = serverDoc.list;
            let next = servers.indexOf(globals.serverName) < serverDoc.next ? serverDoc.next - 1 : serverDoc.next;
            next = next >= (serverDoc.total - 1) ? 0 : next; 
            servers = servers.filter(item => item !== globals.serverName); 
            console.log('fakin servers:', servers, globals.serverName);

            await Servers.updateOne(
                { index: 0 },
                { $set: 
                    { 
                        list: servers, 
                        next,
                        total: servers.length
                    } 
                }
            );
            return { msg: `server [${globals.serverName}] disconnected` }

        } catch (error) {
            console.log(error);
        }
    }

}