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

const {deployContract} = require('ethereum-waffle');
const {ethers} = require("hardhat");
const {writeLogs, Item} = require('../scripts/output.js');

require('dotenv').config({
    path: '.env-Testnet' // test
    // path: '.env-MainnetMock' // uat
    // path: '.env-Mainnet' // prod
});

async function main() {
    const accounts = await ethers.getSigners()
    const zeroAddr = "0x0000000000000000000000000000000000000000"
    const DAI = process.env.DAI
    const USDT = process.env.USDT
    const USDC = process.env.USDC

    let deployer = accounts[0]
    console.log('deployer:' + deployer.address)
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
        "3KEN",
        "3KEN",
        [DAI, USDT, USDC, zeroAddr],
        "100",
        "4000000",
        0, 0);
    console.log("fee:" + fee)
    gasFee = fee.mul(160).div(100)

    let {wait} = await crvFactory.deploy_plain_pool(
        "Klein DAI/USDT/USDC",
        "3KEN",
        [DAI, USDT, USDC, zeroAddr],
        "100",
        "4000000",
        0, 0, {gasLimit: gasFee});

    await wait();

    poolAddress = await crvFactory.pool_list(0);
    pool = await plain3Balances.attach(poolAddress);
    console.log("3ken:" + pool.address)
    
   await crvFactory.deploy_plain_pool(
        "Klein DAI/USDT/USDC",
        "3Pool",
        [DAI, USDT, USDC, zeroAddr],
        "100",
        "4000000",
        0, 0, {gasLimit: gasFee});
    
     pool1Address = await crvFactory.pool_list(1);
    pool1 = await plain3Balances.attach(pool1Address);
    console.log("3pool:" + pool1.address)
    

    metaPool = await deployContract(deployer, {
        bytecode: MetaPool.bytecode,
        abi: MetaPoolAbi.abi
    });
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

    depositZap = await deployContract(deployer, {
        bytecode: DepositZap.bytecode,
        abi: Deposit_zap_abi.abi,
    }, [pool.address, pool.address, [DAI, USDT, USDC]]);
    console.log("depositZap:" + depositZap.address);

    let logs = [];
    logs.push(new Item("deployer", deployer.address));
    logs.push(new Item("plain2Balances", plain2Balances.address));
    logs.push(new Item("plain3Balances", plain3Balances.address));
    logs.push(new Item("plain4Balances", plain4Balances.address));
    logs.push(new Item("registry", registry.address));
    logs.push(new Item("poolRegistry", poolRegistry.address));
    logs.push(new Item("cryptoRegistry", cryptoRegistry.address));
    logs.push(new Item("crvFactory", crvFactory.address));
    logs.push(new Item("3ken", pool.address));
    logs.push(new Item("dai", DAI));
    logs.push(new Item("usdt", USDT));
    logs.push(new Item("usdc", USDC));
    logs.push(new Item("metaPool", metaPool.address));
    logs.push(new Item("depositZap", depositZap.address));
    await writeLogs("plainPools.log", logs);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })