import { Contract } from '@ethersproject/contracts';
import { abi, address } from './contract-data.json';
import web3 from './web3';

const { NODE_ENV, REACT_APP_CONTRACT_ADDRESS } = process.env;

const getAddress = () => {
  if (NODE_ENV === 'production') {
    return address;
  }
  return REACT_APP_CONTRACT_ADDRESS;
};

const contractAddress = getAddress();

const signer = web3.getSigner();

// @ts-expect-error
export default new Contract(contractAddress, abi, signer);
