import { useEffect, useState } from 'react';
import { utils } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import getSbpContract from './sbp';
import { useContractOwner } from './useContractOwner';
import { useCheckWallet } from './useCheckWallet';
import { WrongNetwork } from './WrongNetwork';
import { Header } from './Header';
import { Dashboard } from './Dashboard';
import './Dapp.css';

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainnet
    3, // Ropsten
    4, // Rinkeby
    5777, // Ganache
  ],
});

export const Dapp = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [eligibleBettingEvents, setEligibleBettingEvents] = useState<EligibleBettingEvent[]>([]);

  const owner = useContractOwner();
  const { account, activate, active, chainId, error } = useWeb3React<Web3Provider>();
  const { connectErrorMessage, loading } = useCheckWallet(active, chainId, error);

  // attempt to connect to wallet
  useEffect(() => {
    activate(injectedConnector);
  }, [account, activate, chainId]);

  useEffect(() => {
    if (account) {
      (async () => {
        const sbp = await getSbpContract();

        sbp.on('NewBet', async (betId, sender, eventId, option, payoutOdds, amount) => {
          if (sender === account) {
            const newBet = {
              amount: utils.formatEther(amount),
              eventId: Number(eventId),
              option: Number(option),
              payoutOdds,
            };

            setBets(prev => [...prev, newBet]);
          }
        });
      })();
    }
  }, [account]);

  useEffect(() => {
    (async () => {
      const sbp = await getSbpContract();

      sbp.on('NewEvent', (eventId, option1, option2, startTime, result) => {
        const newEvent = {
          option1,
          option2,
          result,
          startTime,
        };

        setEligibleBettingEvents(prev => [...prev, newEvent]);
      });
    })();
  }, []);

  if (loading) {
    return <>Loading...</>;
  }

  if (connectErrorMessage) {
    return <WrongNetwork error={connectErrorMessage} />;
  }

  return (
    <div className="App">
      <Header account={account} owner={owner} />
      <Dashboard
        bets={bets}
        eligibleBettingEvents={eligibleBettingEvents}
        setBets={setBets}
        setEligibleBettingEvents={setEligibleBettingEvents}
      />
    </div>
  );
};
