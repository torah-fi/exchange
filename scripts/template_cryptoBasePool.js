const {ethers} = require("hardhat");
const {deployContract} = require("ethereum-waffle");

const CryptoMetaPool = require('../test/mock/CryptoBasePool.json');
const Crypto3PoolMath = require('../test/mock/Crypto3PoolMath.json');
const Crypto3PoolMathAbi = require('../test/mock/Crypto3PoolMath_abi.json');
const Crypto3PoolView = require('../test/mock/Crypto3PoolView.json');
const Crypto3PoolViewAbi = require('../test/mock/Crypto3PoolView_abi.json');
const CurveLPToken = require('../test/mock/CurveLPToken.json');
const CurveLPTokenAbi = require('../test/mock/CurveLPToken_abi.json');
const CryptoDepositZap = require('../test/mock/CryptoDepositZap.json');
const CryptoDepositZapAbi = require('../test/mock/CryptoDepositZap_abi.json');
const {writeLogs, Item} = require('../scripts/output.js');

const deploy = async (_crypto0, _crypto1, _lpName, _lpSymbol, _initialPrice = []) => {
    const accounts = await ethers.getSigners()

    const crv3 = process.env.KEN3;
    const crypto_0 = _crypto0;
    const crypto_1 = _crypto1;
    const initialPrice = _initialPrice;

    if (!crv3) {
        throw Error("bad crv3 address.");
    }
    if (!initialPrice || initialPrice.length !== 2) {
        throw Error("bad initialPrice.");
    }

    const deployer = accounts[0]
    console.log('deployer:' + deployer.address)
    console.log('Account balance:', (await deployer.getBalance()).toString() / 10 ** 18)

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

    lpToken = await deployContract(deployer, {
        bytecode: CurveLPToken.bytecode,
        abi: CurveLPTokenAbi.abi
    }, [_lpName, _lpSymbol]);
    console.log("curveLPToken address: " + lpToken.address);

    metaPool = await deployContract(deployer, {
        bytecode: CryptoMetaPool.bytecode,
        abi: CryptoMetaPool.abi
    }, [deployer.address,
        deployer.address,
        "1706400",  // A
        "11800000000000",  // gamma
        "5000000",  // mid_fee
        "30000000",  // out_fee
        "2000000000000",  // allowed_extra_profit
        "500000000000000",  // fee_gamma
        "1000000000000000",  // adjustment_step
        "5000000000",  // admin_fee
        "600",  // ma_half_time
        initialPrice,
        math.address,
        view.address,
        lpToken.address,
        [crv3, crypto_0, crypto_1]
    ]);
    console.log("cryptoBasePool address: " + metaPool.address);

    await lpToken.set_minter(metaPool.address);

    depositZap = await deployContract(deployer, {
        bytecode: CryptoDepositZap.bytecode,
        abi: CryptoDepositZapAbi.abi
    }, [metaPool.address, crv3]);
    console.log("cryptoDepositZap address: " + depositZap.address);

    let logs = [];
    logs.push(new Item("deployer", deployer.address));
    logs.push(new Item("math", math.address));
    logs.push(new Item("view", view.address));
    logs.push(new Item("curveLPToken", lpToken.address));
    logs.push(new Item("cryptoBasePool address", metaPool.address));
    logs.push(new Item("cryptoDepositZap address", depositZap.address));
    logs.push(new Item("crv3 address", crv3));
    logs.push(new Item("crypto_0 address", _crypto0));
    logs.push(new Item("crypto_1 address", _crypto1));
    logs.push(new Item("crypto_0 price", initialPrice[0]));
    logs.push(new Item("crypto_1 price", initialPrice[1]));
    await writeLogs("cryptoBasePool.log", logs);
}

module.exports = {
    deploy
}