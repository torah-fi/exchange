const {ethers} = require("hardhat");
const {deployContract} = require("ethereum-waffle");

const Plain3Balances = require('../test/mock/Plain3Balances.json');
const Pool3Abi = require('../test/mock/3pool_abi.json');
const Factory = require('../test/mock/factory.json');
const FactoryAbi = require('../test/mock/factory_abi.json');
const PoolRegistry = require('../test/mock/PoolRegistry.json');
const Registry = require('../test/mock/Registry.json');
const MetaPool = require("../test/mock/MetaUSDBalances.json");
const MetaPoolAbi = require("../test/mock/meta_pool.json");

async function main() {
    const accounts = await ethers.getSigners()
    const zeroAddress = "0x0000000000000000000000000000000000000000"

    const crv3Address = "0xDde9d4B293F798a73A7986B978DC347F9cB70620"
    const crv3Token0Address = "0xDde9d4B293F798a73A7986B978DC347F9cB70620"
    const crv3Token1Address = "0xDde9d4B293F798a73A7986B978DC347F9cB70620"
    const crv3Token2Address = "0xDde9d4B293F798a73A7986B978DC347F9cB70620"
    const usdCoinAddress = "0xDde9d4B293F798a73A7986B978DC347F9cB70620"

    const metaPool_name = "3ken + BUSD";
    const metaPool_symbol = "3ken + BUSD";

    const deployer = accounts[0]
    console.log('deployer:' + deployer.address)
    console.log('Account balance:', (await deployer.getBalance()).toString());

    metaPool = await deployContract(owner, {
        bytecode: MetaPool.bytecode,
        abi: MetaPoolAbi.abi
    }, [crv3Address, crv3Address, [token0.address, token1.address, zeroAddr]]);


    plain3Balances = await deployContract(deployer, {
        bytecode: Plain3Balances.bytecode,
        abi: Pool3Abi.abi,
    });
    console.log("plain3Balances address: " + plain3Balances.address);

    registry = await deployContract(deployer, {
        bytecode: Registry.bytecode,
        abi: Registry.abi,
    }, [deployer.address]);
    console.log("registry address: " + registry.address);

    poolRegistry = await deployContract(deployer, {
        bytecode: PoolRegistry.bytecode,
        abi: PoolRegistry.abi,
    }, [registry.address, zeroAddress]);
    console.log("poolRegistry address: " + poolRegistry.address);

    await registry.set_address(0, poolRegistry.address);

    factory = await deployContract(deployer, {
        bytecode: Factory.bytecode,
        abi: FactoryAbi.abi,
    }, [deployer.address, poolRegistry.address]);
    console.log("factory address: " + factory.address);

    await factory.add_base_pool(crv3Address, deployer.address, 3, [
        metaPool.address,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr]);

    await factory.set_metapool_implementations(crv3Address, [
        metaPool.address,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr,
        zeroAddr]);

    let count = await crvFactory.pool_count();

    const {wait} = await crvFactory.deploy_metapool(
        crv3Address,
        crv3Address,
        [crv3Token0Address.address, crv3Token1Address.address, crv3Token2Address.address],
        metaPool_name,
        metaPool_symbol,
        usdCoinAddress.address,
        "2000",
        "4000000",
        "0");
    await wait();

    let poolAddress = await factory.pool_list(parseInt(count) + 1);
    console.log("metaPoolAddress: " + poolAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })