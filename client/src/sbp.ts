import { Contract } from '@ethersproject/contracts';
import { abi, address } from './contract-data.json';
import web3 from './web3';

const { NODE_ENV, CONTRACT_DATA_DEV } = process.env;

const getAddress = async () => {
  if (NODE_ENV === 'production') {
    return address;
  }

  return CONTRACT_DATA_DEV;
};

const contractAddress = getAddress();

const signer = web3.getSigner();

// @ts-expect-error
export default new Contract(contractAddress, abi, signer);
