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
const axios = require("axios");
const {Item, writeLogs} = require("./output");

async function getPrice() {
    let url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'

    let ret = []
    await axios.get(url, {responseType: "json"})
        .then(function (resp) {
            // console.log(resp);
            ret[0] = resp.data.bitcoin.usd
            ret[1] = resp.data.ethereum.usd
        })
        .catch(err => {
            // console.log(err)
        });
    return ret;
}

async function main() {

    const accounts = await ethers.getSigners()

    const crv3 = "0x8D800c511D5403A18D7B682E65F638A397D20e98";
    const btc = "0x1E824eF85A7D2e2771127fF351940C475AB2B808"
    const eth = "0xcaEf1eb6bC2FBC41359384dB04E29E1a8352b8d7"

    const deployer = accounts[0]
    console.log('deployer:' + deployer.address)
    console.log('Account balance:', (await deployer.getBalance()).toString())

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
    }, ["Klein USD-BTC-ETH", "kenUSDBTCETH"]);
    console.log("lpToken address: " + lpToken.address);

    // let prices = await getPrice();
    // console.log("bitcoin: " + prices[0])
    // console.log("ethereum: " + prices[1])

    metaPool = await deployContract(deployer, {
        bytecode: CryptoMetaPool.bytecode,
        abi: CryptoMetaPool.abi
    }, [deployer.address,
        deployer.address,
        // parseInt(6.32 * 3 ** 3 * 10000),  // A  1706400
        // parseInt(1.18e-5 * 1e18),  // gamma   11800000000000
        // parseInt(0.5e-3 * 1e10),  // mid_fee   5000000
        // parseInt(3e-3 * 1e10),  // out_fee   30000000
        // 2 * 10 ** 12,  // allowed_extra_profit   2000000000000
        // parseInt(5e-4 * 1e18),  // fee_gamma   500000000000000
        // parseInt(0.001 * 1e18),  // adjustment_step   1000000000000000
        // 5 * 10 ** 9,  // admin_fee   5000000000
        // 600,  // ma_half_time
        // // [toWei(parseInt(prices[0]).toString()), toWei(parseInt(prices[1]).toString())],
        "1706400",  // A  1706400
        "11800000000000",  // gamma   11800000000000
        "5000000",  // mid_fee   5000000
        "30000000",  // out_fee   30000000
        "2000000000000",  // allowed_extra_profit   2000000000000
        "500000000000000",  // fee_gamma   500000000000000
        "1000000000000000",  // adjustment_step   1000000000000000
        "5000000000",  // admin_fee   5000000000
        "600",  // ma_half_time
        // [toWei(parseInt(prices[0]).toString()), toWei(parseInt(prices[1]).toString())],
        ["19671000000000000000000", "1124000000000000000000"],
        math.address,
        view.address,
        lpToken.address,
        [crv3, btc, eth]
    ]);
    console.log("metaPool address: " + metaPool.address);

    await lpToken.set_minter(metaPool.address);

    depositZap = await deployContract(deployer, {
        bytecode: CryptoDepositZap.bytecode,
        abi: CryptoDepositZapAbi.abi
    }, [metaPool.address, crv3]);
    console.log("depositZap address: " + depositZap.address);

    let logs = [];
    logs.push(new Item("deployer", deployer.address));
    logs.push(new Item("crv3", crv3));
    logs.push(new Item("btc", btc));
    logs.push(new Item("eth", eth));
    logs.push(new Item("math", math.address));
    logs.push(new Item("view", view.address));
    logs.push(new Item("lpToken", lpToken.address));
    logs.push(new Item("metaPool", metaPool.address));
    logs.push(new Item("depositZap", depositZap.address));
    await writeLogs("mainnet_3kenBtcEth.log", logs);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })