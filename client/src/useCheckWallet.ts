import { useEffect, useState } from 'react';

const checkNetwork = (chainId: number | undefined) => {
  const { ETHEREUM_NETWORK } = process.env;
  if (ETHEREUM_NETWORK === 'local' && chainId !== 5777) {
    return 'Wrong Chain ID. Set your wallet network to your local network.';
  }

  if (ETHEREUM_NETWORK === 'testnet' && chainId !== 3) {
    return 'Wrong Chain ID. Set your wallet network to the Ropsten network.';
  }

  return '';
};

export const useCheckWallet = (active: boolean, chainId?: number, error?: Error) => {
  const [loading, setLoading] = useState(true);
  const [connectErrorMessage, setConnectErrorMessage] = useState('');

  useEffect(() => {
    if (active || error) {
      setLoading(true);

      const message = checkNetwork(chainId);
      setConnectErrorMessage(message);

      setLoading(false);
    }
  }, [active, chainId, error?.message]);

  return { connectErrorMessage, loading };
};
