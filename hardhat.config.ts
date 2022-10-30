import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-truffle5";
// import "hardhat-gas-reporter";
import "solidity-coverage";
import "@typechain/hardhat";
// import '@openzeppelin/hardhat-upgrades';
import {HardhatUserConfig} from "hardhat/config";

// const keys = require('./dev-keys.json');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            allowUnlimitedContractSize: false,
            // forking: {
            //     //url: "https://mainnet.infura.io/v3/" + keys.infuraKey,
            //     url: "https://eth-mainnet.alchemyapi.io/v2/" + keys.alchemyKey,
            //     blockNumber: 11807770, // <-- edit here
            // }

        },
        rinkebyTest: {
            url: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
            chainId: 4,
            // gasPrice: 20000000000,
            accounts: ['a169188d442a35eff327a448d864d82523f95e07a20e76247230ba38c596d0dd'],
        },
        testnet: {
            url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
            chainId: 97,
            // gasPrice: 20000000000,
            accounts: ['a169188d442a35eff327a448d864d82523f95e07a20e76247230ba38c596d0dd'],
        },
        evmos: {
            url: 'https://ethereum.rpc.evmos.dev',
            chainId: 9000,
            // gasPrice: 20000000000,
            accounts: ['a169188d442a35eff327a448d864d82523f95e07a20e76247230ba38c596d0dd'],
        },
        hecotest: {
            url: 'https://http-testnet.hecochain.com',
            chainId: 256,
            // gasPrice: 20000000000,
            accounts: ['a169188d442a35eff327a448d864d82523f95e07a20e76247230ba38c596d0dd'],
        },
        Mainnet: {
            url: ' https://rpc-mainnet..network',
            chainId: 321,
            // gasPrice: 20000000000,
            accounts: ['028c428a541f66d73f8ebc5e7218f4ac35460288c0c022f6a3e056fa8462ebfb'],
        },
        Test: {
            url: 'https://rpc-testnet..network',
            chainId: 322,
            accounts: ['a169188d442a35eff327a448d864d82523f95e07a20e76247230ba38c596d0dd']
            // gasPrice: 20000000000,
            // accounts: {mnemonic: mnemonic}
        },


    },
    paths: {
        artifacts: './artifacts',
        cache: './cache',
        sources: './contracts',
        tests: './test',
    },
    solidity: {
        compilers: [
            {
                version: "0.4.18",
            }, {
                version: "0.8.4",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    }
                }
            }, {
                version: "0.8.10",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200
                    },
                    metadata: {
                        bytecodeHash: 'none'
                    }
                }
            }
        ]
    },
    mocha: {
        timeout: 2000000
    },
    // gasReporter: {
    //     enabled: (process.env.REPORT_GAS) ? true : false,
    //     currency: 'USD'
    // }
};

export default config;