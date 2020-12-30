import { useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useCheckWallet } from './useCheckWallet';
import { WrongNetwork } from './WrongNetwork';
import { ConnectedDapp } from './ConnectedDapp';

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainnet
    3, // Ropsten
    4, // Rinkeby
    5777, // Ganache
  ],
});

export const Dapp = () => {
  const { account, activate, active, chainId, error } = useWeb3React<Web3Provider>();
  const { connectErrorMessage, loading } = useCheckWallet(active, chainId, error);

  // attempt to connect to wallet
  useEffect(() => {
    activate(injectedConnector);
  }, [account, activate, chainId]);

  if (loading) {
    return <>Loading...</>;
  }

  if (connectErrorMessage) {
    return <WrongNetwork error={connectErrorMessage} />;
  }

  return <ConnectedDapp />;
};
