# E-Communicator

This is a small ethereum blockchain project written in NodeJs. It uses the Express and Web3 framework/library to read and write data to a certain contract on the Kovan test network. Cron jobs are responsible for the API calls

## Starting the server(s)

The application (server) can have multiple instances.
To start one server run the following command in your terminal:

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

To start a cron job navigate to the /cron folder inside the project and run the following command in your terminal:

```
node test.js
```
