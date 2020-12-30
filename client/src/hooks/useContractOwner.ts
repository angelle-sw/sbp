import { useEffect, useState } from 'react';
import getSbpContract from '../sbp';

export const useContractOwner = () => {
  const [owner, setOwner] = useState('');

  useEffect(() => {
    (async () => {
      const sbp = await getSbpContract();

      const response = await sbp.owner();
      setOwner(response);
    })();
  }, []);

  return owner;
};
