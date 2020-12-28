import { Web3Provider } from '@ethersproject/providers';

declare global {
  interface Window {
    web3: any;
  }
}

export default function createWeb3Provider() {
  return new Web3Provider(window.web3.currentProvider);
}
