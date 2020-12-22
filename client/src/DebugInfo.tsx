import { useState, useEffect } from 'react';
import getSbpContract from './sbp';

const { ETHEREUM_NETWORK } = process.env;

export const DebugInfo = () => {
  const [contractAddress, setContractAddress] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const sbp = await getSbpContract();
      setContractAddress(sbp.address);
    })();
  }, []);

  if (ETHEREUM_NETWORK !== 'testnet' || contractAddress === null) {
    return null;
  }

  return (
    <div>
      Contract deployed to Ropsten at&nbsp;
      <a href={`https://ropsten.etherscan.io/address/${contractAddress}`} target="_blank">
        {contractAddress}
      </a>
    </div>
  );
};
