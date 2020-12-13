import { Contract } from '@ethersproject/contracts';
import { abi, networks } from './contract-builds/Sbp.json';
import web3 from './web3';

const { NODE_ENV } = process.env;

let address = '';

if (NODE_ENV === 'production') {
  address = networks?.[3]?.address;
} else if (NODE_ENV === 'development') {
  // @ts-ignore
  address = networks?.[5777]?.address;
}

const signer = web3.getSigner();

export default new Contract(address, abi, signer);
