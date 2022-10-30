const CRVFactory = require('../test/mock/CryptoFactory.json');
const FactoryAbi = require('../test/mock/crpto_factory_abi.json');
const CurveCryptoSwap = require('../test/mock/CurveCryptoSwap2ETH.json');

const PoolAbi = require('../test/mock/CurveCryptoSwap2ETH_abi.json');
const CurveToken = require("../test/mock/CurveTokenV5.json")
const CurveTokenAbi = require("../test/mock/curve_token_v5_abi.json")
const Registry = require("../test/mock/Registry.json");
const PoolRegistry = require("../test/mock/CryptoRegistry.json");

const {deployContract, MockProvider, solidity, Fixture} = require('ethereum-waffle');
const {ethers, waffle} = require("hardhat");
const {expect} = require("chai");
const {toWei} = web3.utils;
const WETH9 = require('../test/mock/WETH9.json');
const {BigNumber} = require('ethers');

async function main() {
    const accounts = await ethers.getSigners()
    const zeroAddr = "0x0000000000000000000000000000000000000000"
    // const bsc_wbnb = "0xABbc0dB80d50e4175CEC6A0efd43994a00c19b5F"
    // const evmos_wbnb = "0x69E205B75Ad711c41767046aA4C63d74744Ae641"
    // const heco_wht = "0x7af326b6351c8a9b8fb8cd205cbe11d4ac5fa836"
    const _wbnb = "0xB296bAb2ED122a85977423b602DdF3527582A3DA"


    for (const account of accounts) {
        //console.log('Account address' + account.address)
    }


    let deployer = accounts[0]
    console.log('deployer:' + deployer.address)
    // We get the contract to deploy
    console.log('Account balance:', (await deployer.getBalance()).toString())

    // weth9 = await deployContract(deployer, {
    //     bytecode: WETH9.bytecode,
    //     abi: WETH9.abi,
    // });
    // console.log("weth9:" + weth9.address)

    curveCryptoSwap = await deployContract(deployer, {
        bytecode: CurveCryptoSwap.bytecode,
        abi: PoolAbi.abi
    }, [_wbnb])
    console.log("curveCryptoSwap:" + curveCryptoSwap.address)


    curveToken = await deployContract(deployer, {
        bytecode: CurveToken.bytecode,
        abi: CurveTokenAbi.abi
    });
    console.log("curveTokenV5:" + curveToken.address)
    // let curveCryptoSwap = "0xCD5DF544b5663f08Cf84DD73aF096655D7d456b7"
    //     let curveToken = "0xD72f4E8d247aD02079a59F94d380b90086c5c53E"

    crvFactory = await deployContract(deployer, {
        bytecode: CRVFactory.bytecode,
        abi: FactoryAbi.abi,
    }, [deployer.address,
        curveCryptoSwap.address,
        curveToken.address,
        zeroAddr,
        _wbnb])

    console.log("crpto_factory:" + crvFactory.address)


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })