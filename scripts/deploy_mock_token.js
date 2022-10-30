const {ethers} = require("hardhat");
const {toWei} = require("web3-utils");
const {writeLogs, Item} = require("../scripts/output");

async function main() {
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]
    console.log('deployer:' + deployer.address)

    const MockToken = await ethers.getContractFactory("MockToken");
    dev_dai = await MockToken.deploy("dev_dai", "dev_dai", 18, toWei("1000000000"));
    dev_usdt = await MockToken.deploy("dev_usdt", "dev_usdt", 18, toWei("1000000000"));
    dev_usdc = await MockToken.deploy("dev_usdc", "dev_usdc", 18, toWei("1000000000"));
    dev_btc = await MockToken.deploy("dev_btc", "dev_btc", 18, toWei("1000000000"));
    dev_eth = await MockToken.deploy("dev_eth", "dev_eth", 18, toWei("1000000000"));

    console.log("dev_dai: " + dev_dai.address);
    console.log("dev_usdt: " + dev_usdt.address);
    console.log("dev_usdc: " + dev_usdc.address);
    console.log("dev_btc: " + dev_btc.address);
    console.log("dev_eth: " + dev_eth.address);

    let logs = [];
    logs.push(new Item("deployer", deployer.address));
    logs.push(new Item("dev_dai", dev_dai.address));
    logs.push(new Item("dev_usdt", dev_usdt.address));
    logs.push(new Item("dev_usdc", dev_usdc.address));
    logs.push(new Item("dev_btc", dev_btc.address));
    logs.push(new Item("dev_eth", dev_eth.address));
    await writeLogs("mainnet_mock_token.log", logs);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })