const {deploy} = require('../template_crypto2BasePool');
const {toWei} = require("web3-utils");

require('dotenv').config({
    // path: '.env-Testnet' // test
    path: '.env-MainnetMock' // uat
    // path: '.env-Mainnet' // prod
});

async function main() {
    const weth = process.env.Weth;
    const lpName = "Klein Weth-3Ken";
    const lpSymbol = "dev_kenWethUSD";
    const initialPrice = toWei("9.5");

    await deploy(weth, lpName, lpSymbol, initialPrice);

    console.log("completed")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })