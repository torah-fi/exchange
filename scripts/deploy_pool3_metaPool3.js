const {ethers} = require("hardhat");
const {deployContract} = require("ethereum-waffle");
const {BigNumber} = require("ethers");
const {toWei, fromWei, toBN, hexToString} = web3.utils;
const {expect} = require("chai");

const CryptoMetaPool = require('../test/mock/CryptoBasePool.json');
const CryptoMetaPoolAbi = require('../test/mock/CryptoBasePool_abi.json');
const WETH = require('../test/mock/WETH9.json');
const Plain3Balances = require('../test/mock/Plain3Balances.json');
const Pool3Abi = require('../test/mock/3pool_abi.json');
const Factory = require('../test/mock/factory.json');
const FactoryAbi = require('../test/mock/factory_abi.json');
const PoolRegistry = require('../test/mock/PoolRegistry.json');
const Registry = require('../test/mock/Registry.json');
const Crypto3PoolMath = require('../test/mock/Crypto3PoolMath.json');
const Crypto3PoolMathAbi = require('../test/mock/Crypto3PoolMath_abi.json');
const Crypto3PoolView = require('../test/mock/Crypto3PoolView.json');
const Crypto3PoolViewAbi = require('../test/mock/Crypto3PoolView_abi.json');
const CurveLPToken = require('../test/mock/CurveLPToken.json');
const CurveLPTokenAbi = require('../test/mock/CurveLPToken_abi.json');
const CryptoDepositZap = require('../test/mock/CryptoDepositZap.json');
const CryptoDepositZapAbi = require('../test/mock/CryptoDepositZap_abi.json');
const axios = require("axios");

async function getPrice() {
    let url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'

    let ret = []
    await axios.get(url, {responseType: "json"})
        .then(function (resp) {
            ret[0] = resp.data.bitcoin.usd
            ret[1] = resp.data.ethereum.usd
        })
        .catch(err => {
            console.log(err)
        });
    return ret;
}

async function main() {
    const accounts = await ethers.getSigners()
    const zeroAddress = "0x0000000000000000000000000000000000000000"
    // const token0 = "0xDde9d4B293F798a73A7986B978DC347F9cB70620"
    // const token1 = "0x1d870E0bDF106B8E515Ed0276ACa660c30a58D3A"
    // const token2 = "0x8D1B35DBb6CA2E01a9C5E66cE3e29D55BAf416E3"
    // const btc = "0x64ED9cD3590d391c88d74eC4b7e14dD5Da0391De"
    // const weth = "0x5A3Df3B294E63eeB0695B368Bf36B44A3af4aE95"
      const btc = "0x727c36f49f1ed5bb24f8617cd68128d16b9418b1"
    const weth = "0x88d47b44b9408cd398f10bbce85732a2e32fc647"
    const pool3Address = "0x217d950570B256774D3b824723F7570f5E1c6FBf"

    const deployer = accounts[0]
    console.log('deployer:' + deployer.address)
    console.log('Account balance:', (await deployer.getBalance()).toString())

    // deploy
    // plain3Balances = await deployContract(deployer, {
    //     bytecode: Plain3Balances.bytecode,
    //     abi: Pool3Abi.abi,
    // });
    // console.log("plain3Balances address: " + plain3Balances.address);
    //
    // registry = await deployContract(deployer, {
    //     bytecode: Registry.bytecode,
    //     abi: Registry.abi,
    // }, [deployer.address]);
    // console.log("registry address: " + registry.address);
    //
    // poolRegistry = await deployContract(deployer, {
    //     bytecode: PoolRegistry.bytecode,
    //     abi: PoolRegistry.abi,
    // }, [registry.address, zeroAddress]);
    // console.log("poolRegistry address: " + poolRegistry.address);
    //
    // await registry.set_address(0, poolRegistry.address);
    //
    // factory = await deployContract(deployer, {
    //     bytecode: Factory.bytecode,
    //     abi: FactoryAbi.abi,
    // }, [deployer.address, poolRegistry.address]);
    // console.log("factory address: " + factory.address);
    //
    // await factory.set_plain_implementations(3, [
    //     plain3Balances.address,
    //     zeroAddress,
    //     zeroAddress,
    //     zeroAddress,
    //     zeroAddress,
    //     zeroAddress,
    //     zeroAddress,
    //     zeroAddress,
    //     zeroAddress,
    //     zeroAddress,
    // ], {gasLimit:"21000000"});
    //
    // const {wait} = await factory.deploy_plain_pool(
    //     "pool3",
    //     "pool3",
    //     [token0, token1, token2, zeroAddress],
    //     "200",
    //     "4000000",
    //     0, 0, {gasLimit:"21000000"});
    //
    // await wait();
    //
    // let pool3Address = await factory.pool_list(0);
    // console.log("pool3Address: " + pool3Address);

    math = await deployContract(deployer, {
        bytecode: Crypto3PoolMath.bytecode,
        abi: Crypto3PoolMathAbi.abi
    });
    console.log("math address: " + math.address);

    view = await deployContract(deployer, {
        bytecode: Crypto3PoolView.bytecode,
        abi: Crypto3PoolViewAbi.abi
    }, [math.address]);
    console.log("view address: " + view.address);

    curveToken = await deployContract(deployer, {
        bytecode: CurveLPToken.bytecode,
        abi: CurveLPTokenAbi.abi
    }, ["pool5", "pool5"]);
    console.log("curveToken address: " + curveToken.address);

    // let prices = await getPrice();
    // console.log("bitcoin: " + prices[0])
    // console.log("ethereum: " + prices[1])

    metaPool = await deployContract(deployer, {
        bytecode: CryptoMetaPool.bytecode,
        abi: CryptoMetaPool.abi
    }, [deployer.address,
        deployer.address,
        parseInt(6.32 * 3 ** 3 * 10000),  // A
        parseInt(1.18e-5 * 1e18),  // gamma
        parseInt(0.5e-3 * 1e10),  // mid_fee
        parseInt(3e-3 * 1e10),  // out_fee
        2 * 10 ** 12,  // allowed_extra_profit
        parseInt(5e-4 * 1e18),  // fee_gamma
        parseInt(0.001 * 1e18),  // adjustment_step
        5 * 10 ** 9,  // admin_fee
        600,  // ma_half_time
        [toWei("31826"), toWei("1940")],
        math.address,
        view.address,
        curveToken.address,
        [pool3Address, btc, weth]
    ]);
    console.log("metaPool address: " + metaPool.address);

    await curveToken.set_minter(metaPool.address);

    depositZap = await deployContract(deployer, {
        bytecode: CryptoDepositZap.bytecode,
        abi: CryptoDepositZap.abi
    }, [metaPool.address, pool3Address]);
    console.log("depositZap address: " + depositZap.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })