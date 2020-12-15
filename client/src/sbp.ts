import { Contract } from '@ethersproject/contracts';
import { abi, address } from './contract-data.json';
import web3 from './web3';

const { NODE_ENV, CONTRACT_DATA_DEV } = process.env;

const getAddress = () => {
  if (NODE_ENV === 'production') {
    return address;
  }

  if (CONTRACT_DATA_DEV) {
    return JSON.parse(CONTRACT_DATA_DEV).address;
  }

  return null;
};

const contractAddress = getAddress();

const signer = web3.getSigner();

export default new Contract(contractAddress, abi, signer);
