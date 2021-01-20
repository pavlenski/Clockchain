# RW-3000

This is a small ethereum blockchain project written in NodeJs. It uses the Express and Web3 framework/library to read and write data to a certain contract on the Kovan test network. Cron jobs are responsible for the API calls

## Starting a server

The application (server) can have multiple instances.
To create one instance of the server run the following command in your terminal:

```
node index.js serverName port walletAddress privateKeyHash
```

#### Arguments

* `serverName`: A suitable name for your server
* `port`: The port you wish to run your server on
* `walletAddres`: The public address of your MetaMask account
* `privateKeyHash`: The private key of your MetaMask account

#### Example

```
node index.js Charlie 3000 0x316... 0xB73...
```

## Creating cron jobs

To start the cron jobs navigate to the /cron folder inside the project and run the following command in your terminal:

```
node crons.js port1 port2 portN
```

#### Arguments

The arguments `port1`, `port2` and so on correspond to the ports on which the previously made servers are running.

#### Example

If you're running three servers like:

Server | Port
------ | ----
Charlie | 3000
Bravo | 3010
Echo | 3020

To start a cron job for this batch of servers you would enter the following command in your terminal:

```
node crons.js 3000 3010 3020
```
