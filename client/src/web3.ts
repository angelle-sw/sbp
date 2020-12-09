import { Web3Provider } from '@ethersproject/providers';

declare global {
  interface Window {
    web3: any;
  }
}

window.web3 = window.web3 || {};

const web3 = new Web3Provider(window.web3.currentProvider);

export default web3;
