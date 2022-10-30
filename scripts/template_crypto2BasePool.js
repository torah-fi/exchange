const {ethers} = require("hardhat");
const {deployContract} = require("ethereum-waffle");

const Crypto2BasePool = require('../test/mock/Crypto2BasePool.json');
const Crypto2BasePoolAbi = require('../test/mock/Crypto2BasePool_abi.json');
const CurveLPToken = require('../test/mock/CurveLPToken.json');
const CurveLPTokenAbi = require('../test/mock/CurveLPToken_abi.json');
const CryptoDeposit4Zap = require('../test/mock/CryptoDeposit4Zap.json');
const CryptoDeposit4ZapAbi = require('../test/mock/CryptoDeposit4Zap_abi.json');
const {writeLogs, Item} = require('../scripts/output.js');

const deploy = async (_token, _lpName, _lpSymbol, _initialPrice) => {
    const accounts = await ethers.getSigners()

    const crv3 = process.env.KEN3;
    const token = _token;
    const initialPrice = _initialPrice;

    if (!crv3) {
        throw Error("bad crv3 address.");
    }

    const deployer = accounts[0]
    console.log('deployer:' + deployer.address)
    console.log('Account balance:', (await deployer.getBalance()).toString() / 10 ** 18)

    lpToken = await deployContract(deployer, {
        bytecode: CurveLPToken.bytecode,
        abi: CurveLPTokenAbi.abi
    }, [_lpName, _lpSymbol]);
    console.log("curveLPToken address: " + lpToken.address);

    basePool = await deployContract(deployer, {
        bytecode: Crypto2BasePool.bytecode,
        abi: Crypto2BasePoolAbi.abi
    }, [deployer.address,
        deployer.address,
        "200000000",  // A                        5000 * 2**2 * 10000
        "100000000000000",  // gamma              int(1e-4 * 1e18)
        "5000000",  // mid_fee                    int(5e-4 * 1e10)
        "45000000",  // out_fee                   int(45e-4 * 1e10)
        "10000000000",  // allowed_extra_profit   10**10
        "5000000000000000",  // fee_gamma         int(5e-3 * 1e18)
        "5500000000000",  // adjustment_step      int(0.55e-5 * 1e18)
        "5000000000",  // admin_fee               5 * 10**9
        "600",  // ma_half_time                   600
        initialPrice,  // initial_price
        lpToken.address,
        [token, crv3]
    ]);
    console.log("crypto2BasePool address: " + basePool.address);

    await lpToken.set_minter(basePool.address);

    depositZap = await deployContract(deployer, {
        bytecode: CryptoDeposit4Zap.bytecode,
        abi: CryptoDeposit4ZapAbi.abi
    }, [basePool.address, crv3]);
    console.log("cryptoDeposit4Zap address: " + depositZap.address);

    let logs = [];
    logs.push(new Item("deployer", deployer.address));
    logs.push(new Item("curveLPToken", lpToken.address));
    logs.push(new Item("crypto2BasePool address", basePool.address));
    logs.push(new Item("cryptoDeposit4Zap address", depositZap.address));
    logs.push(new Item("crv3 address", crv3));
    logs.push(new Item("token address", token));
    logs.push(new Item("initial price", initialPrice));
    await writeLogs("crypto2BasePool.log", logs);
}

module.exports = {
    deploy
}