module.exports = {

    ethereumPriceURL: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
    providerURL: 'https://kovan.infura.io/v3/2cd65820208443a6a034f10a6ec1d427',
    contractID: '0xeB23AB1b43B414e15430aA9a33A7915aA81A2268',
    contractABI: [{"inputs":[{"internalType":"uint256","name":"_ethPrice","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"getLastSetTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newPrice","type":"uint256"}],"name":"setEthPrice","outputs":[],"stateMutability":"nonpayable","type":"function"}],
    fifteenMinutes: 15 * 60,
    gasPrice: 1

}