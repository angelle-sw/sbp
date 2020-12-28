import { Contract } from '@ethersproject/contracts';
import createWeb3Provider from './web3';

const { ETHEREUM_NETWORK } = process.env;

const getContractData = async () => {
  const contract = await import(`../../build/contracts/${ETHEREUM_NETWORK}/Sbp.json`);
  const network = Object.keys(contract.networks)[0];

  return {
    address: contract.networks[network].address,
    abi: contract.abi,
  };
};

export default async () => {
  const web3 = createWeb3Provider();

  const contractData = await getContractData();
  const signer = web3.getSigner();

  return new Contract(contractData.address, contractData.abi, signer);
};
