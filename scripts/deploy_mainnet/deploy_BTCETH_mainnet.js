const {deploy} = require('../template_cryptoBasePool');
const {toWei} = require("web3-utils");

require('dotenv').config({
    // path: '.env-Testnet' // test
    // path: '.env-MainnetMock' // uat
    path: '.env-Mainnet' // prod
});

async function main() {
    const btc = process.env.BTC;
    const eth = process.env.ETH;
    const lpName = "Klein USD-BTC-ETH";
    const lpSymbol = "kenUSDBTCETH";
    const initialPrice = ["22259000000000000000000", "1478000000000000000000"];

    await deploy(btc, eth, lpName, lpSymbol, initialPrice);

    console.log("completed")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })