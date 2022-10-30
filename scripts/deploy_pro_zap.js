const {ethers} = require("hardhat");
const {deployContract} = require("ethereum-waffle");

const CryptoDepositZap = require('../test/mock/CryptoDepositZap.json');
const CryptoDepositZapAbi = require('../test/mock/CryptoDepositZap_abi.json');
require('dotenv').config();

async function main() {
    const crv3 = "0xF5e5C4514d5F17b2a3A89e11a4853302098399AB"
    const metaPool = "0x65841a9ED311C93608Dd81F7f0eeceB550f5205A"

    const accounts = await ethers.getSigners()
    let deployer = accounts[0]
    console.log('deployer:' + deployer.address)
    // We get the contract to deploy
    console.log('Account balance:', (await deployer.getBalance()).toString())

    depositZap = await deployContract(deployer, {
        bytecode: CryptoDepositZap.bytecode,
        abi: CryptoDepositZapAbi.abi
    }, [metaPool, crv3]);
    console.log("cryptoDepositZap address: " + depositZap.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })