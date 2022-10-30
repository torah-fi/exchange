const CRVFactory = require('../test/mock/factory.json');
const FactoryAbi = require('../test/mock/factory_abi.json');
const Plain2Balances = require('../test/mock/Plain2Balances.json');
const PoolAbi2 = require('../test/mock/2pool_abi.json');

const Plain3Balances = require('../test/mock/Plain3Balances.json');
const PoolAbi3 = require('../test/mock/3pool_abi.json');

const Plain4Balances = require('../test/mock/Plain4Balances.json');
const PoolAbi4 = require('../test/mock/4pool_abi.json');

const Registry = require("../test/mock/Registry.json");
const PoolRegistry = require("../test/mock/PoolRegistry.json");
const CryptoRegistry = require("../test/mock/CryptoRegistry.json");
const MetaPool = require('../test/mock/MetaUSDBalances.json');
const MetaPoolAbi = require('../test/mock/meta_pool.json');
const DepositZap = require('../test/mock/DepositZap.json');
const Deposit_zap_abi = require('../test/mock/deposit_zap_abi.json');


const { deployContract, MockProvider, solidity, Fixture } = require('ethereum-waffle');
const { ethers, waffle } = require("hardhat");
// const {toWei} = web3.utils;
const { BigNumber } = require('ethers');

//const Operatable = require('./mock/Operatable.json')
async function main() {

    async function getUint8Array(len) {
        let buffer = new ArrayBuffer(len);
        let bufferArray = new Uint8Array(buffer);
        let length = bufferArray.length;
        for (let i = 0;i < length;i++) {
            bufferArray[i] = 0;
        }

        return bufferArray;
    }
    const accounts = await ethers.getSigners()
    const zeroAddr = "0x0000000000000000000000000000000000000000"
    // let token0 = "0x1153335a3c0f3c2036D239f3A378aA149101D569"//usdc
    // let token1 = "0x11cc35cEEc84058a61705fE219496D67c0834a4d"//usdt
    // let token2 = "0x4B6a673B282442543F81D88c79f4754f42De4993"//busd

    let token0 = "0x1d870E0bDF106B8E515Ed0276ACa660c30a58D3A"//usdc
    let token1 = "usdt0x8D1B35DBb6CA2E01a9C5E66cE3e29D55BAf416E3"//usdt
    let token2 = "0xDde9d4B293F798a73A7986B978DC347F9cB70620"//busd
    
    // let metaPool = "0x812B6bc138c1d2140651352DcE469F29ba6efEba"
    // let factoryAddr = "0xD3EDc51caC422cCcC91FB1015259bF939B3A8420"
    // let poolAddress = "0x83c754dCb1B8dBaDa580eBD90F190bC574076712"
    // let registry = "0x89b009E078E4bbFFd241A867da73621D42A13470"
    // let token0 = "0xE0Fb5e01150c43bc2e9348fAa148C72e5b6C1c2A"//usdc
    // let token1 = "0x44F41632935FBB9bd911Bc095c0E0E1369B8f607"//usdt
    // let token2 ="0x1d8CaAfEfa64200dC0551f7d3c6f85e4D5Cb2Ab9"//busd




    for (const account of accounts) {
        //console.log('Account address' + account.address)
    }


    let deployer = accounts[0]
    console.log('deployer:' + deployer.address)
    // We get the contract to deploy
    console.log('Account balance:', (await deployer.getBalance()).toString() / 10 ** 18)

    plain2Balances = await deployContract(deployer, {
        bytecode: Plain2Balances.bytecode,
        abi: PoolAbi2.abi
    });
    console.log("plain2Balances:" + plain2Balances.address)

    plain3Balances = await deployContract(deployer, {
        bytecode: Plain3Balances.bytecode,
        abi: PoolAbi3.abi
    });
    console.log("plain3Balances:" + plain3Balances.address)

    plain4Balances = await deployContract(deployer, {
        bytecode: Plain4Balances.bytecode,
        abi: PoolAbi4.abi
    });
    console.log("plain4Balances:" + plain4Balances.address)


    registry = await deployContract(deployer, {
        bytecode: Registry.bytecode,
        abi: Registry.abi
    }, [deployer.address]);
    console.log("registry:" + registry.address)
    //let registryAddress  = "0xBe2099b7262D3a65E5e4550Fce412B1310895FD3"


    poolRegistry = await deployContract(deployer, {
        bytecode: PoolRegistry.bytecode,
        abi: PoolRegistry.abi
    }, [registry.address, zeroAddr]);
    console.log("poolRegistry:" + poolRegistry.address)

    cryptoRegistry = await deployContract(deployer, {
        bytecode: CryptoRegistry.bytecode,
        abi: CryptoRegistry.abi
    }, [registry.address]);

    console.log("cryptoRegistry:" + cryptoRegistry.address)

    await registry.set_address(0, poolRegistry.address);
    await registry.add_new_id(cryptoRegistry.address, "cryptoRegistry")

    crvFactory = await deployContract(deployer, {
        bytecode: CRVFactory.bytecode,
        abi: FactoryAbi.abi,
    }, [deployer.address, registry.address])
    console.log("crvFactory:" + crvFactory.address)
    //let factory = await crvFactory.attach(factoryAddr)
    // console.log("crvFactory:" + crvFactory.address)
    // // let crvFactory =  await crvFactory.attach("0xb3E2F6A6c077d15B7422F6915f6cDA1f09ede9A6")

    await crvFactory.set_plain_implementations(2,
        [
            plain2Balances.address,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr])
    await crvFactory.set_plain_implementations(3,
        [
            plain3Balances.address,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr])

    await crvFactory.set_plain_implementations(4,
        [
            plain4Balances.address,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr,
            zeroAddr])



    let fee = await crvFactory.estimateGas.deploy_plain_pool(
        "3ken",
        "3ken",
        [token0, token1, token2, zeroAddr],
        "200",
        "4000000",
        0, 0);

    console.log("fee:" + fee)


    // const raiseFee = BigNumber.from(fee).mul(fee)
    // const raiseFee = BigNumber.from(160).div(100)
    // const gasFee = BigNumber.from(fee).mul(raiseFee)

    gasFee = fee.mul(160).div(100)


    let { wait } = await crvFactory.deploy_plain_pool(
        "3ken",
        "3ken",
        [token0, token1, token2, zeroAddr],
        "200",
        "4000000",
        0, 0, { gasLimit: gasFee });

    await wait();

    poolAddress = await crvFactory.pool_list(0);
    pool = await plain3Balances.attach(poolAddress);
    console.log("3kenPool:" + pool.address)
    
    
    await crvFactory.deploy_plain_pool(
        "pool3",
        "pool3",
        [token0, token1, token2, zeroAddr],
        "200",
        "4000000",
        0, 0, { gasLimit: gasFee });
    
    
     pool3Address = await crvFactory.pool_list(1);
    pool3 = await plain3Balances.attach(pool3Address);
    console.log("pool3:" + pool3.address)

    
    



    // await poolRegistry.add_pool(poolAddress, 3, poolAddress, 18, "test", {
    //     gasLimit: "1250000",
    // });

    let result = await getUint8Array(32);
    await poolRegistry.add_pool_without_underlying(pool.address, 3, pool.address, result, 18, 18, true, false, "test", {
        gasLimit: "1250000",
    })


    metaPool = await deployContract(deployer, {
        bytecode: MetaPool.bytecode,
        abi: MetaPoolAbi.abi
    }, [pool.address, pool.address, [token0, token1, token2]]);
    console.log("metaPool:" + metaPool.address)


    await crvFactory.add_base_pool(poolAddress, deployer.address, 3, [
        metaPool.address,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr], {
        gasLimit: "3250000"
    });
    console.log("11111111111111")

    await crvFactory.set_metapool_implementations(poolAddress, [
        metaPool.address,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr], {
        gasLimit: "3250000"
    });
    console.log("2222222222222222")

    depositZap = await deployContract(deployer, {
        bytecode: DepositZap.bytecode,
        abi: Deposit_zap_abi.abi,
    }, [pool.address, pool.address, [token0, token1, token2]]);
    console.log("depositZap:" + depositZap.address);



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })