import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { BrowserRouter } from 'react-router-dom';
import Dapp from './Dapp';
import { NoWallet } from './NoWallet';

const getLibrary = (provider: any): Web3Provider => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

export default () => {
  if (window.web3) {
    return (
      <Web3ReactProvider getLibrary={getLibrary}>
        <BrowserRouter>
          <Dapp />
        </BrowserRouter>
      </Web3ReactProvider>
    );
  }

  return <NoWallet />;
};
