import { Contract } from '@ethersproject/contracts';
import { abi, address } from './contract-data.json';
import web3 from './web3';

const { NODE_ENV } = process.env;

const getAddress = async () => {
  if (NODE_ENV === 'production') {
    return address;
  }

  // @ts-ignore
  const contract = await import('./contract-data-dev.json');
  // @ts-ignore
  return contract.address;
};

const contractAddress = getAddress();

const signer = web3.getSigner();

// @ts-expect-error
export default new Contract(contractAddress, abi, signer);
