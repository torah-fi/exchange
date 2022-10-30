const {ethers} = require("hardhat");
const {deployContract} = require("ethereum-waffle");

const Plain3Balances = require('../test/mock/Plain3Balances.json');
const Pool3Abi = require('../test/mock/3pool_abi.json');
const Factory = require('../test/mock/factory.json');
const FactoryAbi = require('../test/mock/factory_abi.json');
const PoolRegistry = require('../test/mock/PoolRegistry.json');
const Registry = require('../test/mock/Registry.json');
const {Item, writeLogs} = require("./output");

async function main() {
    const accounts = await ethers.getSigners()
    const zeroAddress = "0x0000000000000000000000000000000000000000"

    const dai = "0xf9C022b841FBd2C4236BD12B13712D78A4c3AAd4"
    const usdt = "0xd7CC46026f68Ac151C29440d5787494bdcbcDCC0"
    const usdc = "0x51a93236661cdd400eE4Fd6b87090f8790D9fD1F"

    const poolName = "Klein DAI/USDT/USDC Pool";
    const poolSymbol = "3POOL";

    const deployer = accounts[0]
    console.log('deployer:' + deployer.address)
    console.log('Account balance:', (await deployer.getBalance()).toString())

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

    await factory.set_plain_implementations(3, [
        plain3Balances.address,
        zeroAddress,
        zeroAddress,
        zeroAddress,
        zeroAddress,
        zeroAddress,
        zeroAddress,
        zeroAddress,
        zeroAddress,
        zeroAddress,
    ], {gasLimit: "21000000"});

    const {wait} = await factory.deploy_plain_pool(
        poolName,
        poolSymbol,
        [dai, usdt, usdc, zeroAddress],
        "100",
        "4000000",
        0, 0, {gasLimit: "21000000"});

    await wait();

    let poolAddress = await factory.pool_list(0);
    console.log("poolAddress: " + poolAddress);


    let logs = [];
    logs.push(new Item("deployer", deployer.address));
    logs.push(new Item("dai", dai));
    logs.push(new Item("usdt", usdt));
    logs.push(new Item("usdc", usdc));
    logs.push(new Item("plain3Balances", plain3Balances.address));
    logs.push(new Item("registry", registry.address));
    logs.push(new Item("poolRegistry", poolRegistry.address));
    logs.push(new Item("factory", factory.address));
    logs.push(new Item("poolAddress", poolAddress.address));
    await writeLogs("mainnet_3pool.log", logs);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })