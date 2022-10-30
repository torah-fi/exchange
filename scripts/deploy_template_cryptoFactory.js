const CRVFactory = require('../test/mock/CryptoFactory.json');
const FactoryAbi = require('../test/mock/crpto_factory_abi.json');
const CurveCryptoSwap = require('../test/mock/CurveCryptoSwap2ETH.json');
const PoolAbi = require('../test/mock/CurveCryptoSwap2ETH_abi.json');
const CurveToken = require("../test/mock/CurveTokenV5.json")
const CurveTokenAbi = require("../test/mock/curve_token_v5_abi.json")

const {deployContract} = require('ethereum-waffle');
const {ethers} = require("hardhat");
const {Item, writeLogs} = require("../scripts/output");

require('dotenv').config({
    path: '.env-Testnet' // test
    // path: '.env-MainnetMock' // uat
    // path: '.env-Mainnet' // prod
});

async function main() {
    const accounts = await ethers.getSigners()
    const zeroAddr = "0x0000000000000000000000000000000000000000"
    const weth = process.env.Weth

    let deployer = accounts[0]
    console.log('deployer:' + deployer.address)
    console.log('Account balance:', (await deployer.getBalance()).toString())


    curveCryptoSwap = await deployContract(deployer, {
        bytecode: CurveCryptoSwap.bytecode,
        abi: PoolAbi.abi
    }, [weth])
    console.log("curveCryptoSwap:" + curveCryptoSwap.address)


    curveToken = await deployContract(deployer, {
        bytecode: CurveToken.bytecode,
        abi: CurveTokenAbi.abi
    });
    console.log("curveTokenV5:" + curveToken.address)

    crvFactory = await deployContract(deployer, {
        bytecode: CRVFactory.bytecode,
        abi: FactoryAbi.abi,
    }, [deployer.address,
        curveCryptoSwap.address,
        curveToken.address,
        zeroAddr,
        weth])

    console.log("crpto_factory:" + crvFactory.address)


    let logs = [];
    logs.push(new Item("deployer:", deployer.address));
    logs.push(new Item("curveCryptoSwap:", curveCryptoSwap.address));
    logs.push(new Item("curveTokenV5:", curveToken.address));
    logs.push(new Item("crypto_factory:", crvFactory.address));
    logs.push(new Item("weth:", weth));
    await writeLogs("cryptoFactory.log", logs);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })