const Servers = require('../models/servers');
const globals = require('../utils/globals');

function checkServerName(serverList) {

    let isUsed = false;
    serverList.forEach( item => {
        if(item === globals.serverName){
            isUsed = true;
        }
    });

    return isUsed;
}

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
            let response = {
                err: null,
                msg: `[${globals.serverName}]: registered`
            };
            
            const serverDoc = await Servers.findOne({ index: 0 });
            let servers = serverDoc.list;
            
            if(checkServerName(servers)) {
                response.err = 'SERVER ALREADY EXISTING'
                response.msg = `Server with name ${globals.serverName} already exisits, terminating..`
                return response;
            }

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
            return response   

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
            return { msg: `Server [${globals.serverName}] disconnected.` }

        } catch (error) {
            console.log(error);
        }
    }

}