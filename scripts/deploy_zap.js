const {ethers} = require("hardhat");
const {deployContract} = require("ethereum-waffle");

const CryptoDepositZap = require('../test/mock/CryptoDepositZap.json');
const CryptoDepositZapAbi = require('../test/mock/CryptoDepositZap_abi.json');
require('dotenv').config();

async function main() {

    const accounts = await ethers.getSigners()
    let deployer = accounts[0]
    console.log('deployer:' + deployer.address)
    // We get the contract to deploy
    console.log('Account balance:', (await deployer.getBalance()).toString())

    depositZap = await deployContract(deployer, {
        bytecode: CryptoDepositZap.bytecode,
        abi: CryptoDepositZapAbi.abi
    }, ["0x609a84b30c62376C8f4fB1eF9d032E3E8EaD9628", "0x74e51a058768BAA4F1B7Ef8A180bEc8183cF3CFD"]);
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