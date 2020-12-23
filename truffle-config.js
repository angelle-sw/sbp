const HDWalletProvider = require('@truffle/hdwallet-provider');

require('dotenv').config();

require('ts-node').register({
  files: true,
});

const { TEST_ENDPOINT, WALLET_INDEX, WALLET_MNEMONIC, ETHEREUM_NETWORK } = process.env;

module.exports = {
  contracts_build_directory: `./build/contracts/${ETHEREUM_NETWORK}`,
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: 5777,
    },
    testnet: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: WALLET_MNEMONIC,
          providerOrUrl: TEST_ENDPOINT,
          addressIndex: WALLET_INDEX,
        }),
      network_id: 3,
    },
  },
  compilers: {
    solc: {
      version: '0.7.4'
    },
  },
  plugins: ['solidity-coverage'],
};
