import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dapp from './Dapp';
import { AddEvent } from './AddEvent';
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
          <Routes>
            <Route path="/">
              <Dapp />
            </Route>
            <Route path="/add-event">
              <AddEvent />
            </Route>
          </Routes>
        </BrowserRouter>
      </Web3ReactProvider>
    );
  }

  return <NoWallet />;
};
