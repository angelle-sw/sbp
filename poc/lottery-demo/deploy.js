require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('../compile');

const { object: bytecode } = evm.bytecode;

const { INFURA_RINKEBY_ENDPOINT, WALLET_SECRET } = process.env;

const provider = new HDWalletProvider(
  WALLET_SECRET,
  INFURA_RINKEBY_ENDPOINT,
  1,
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log(abi);
  console.log('contract deployed to', result.options.address);
};

deploy(); // deploys contract to rinkeby test network
