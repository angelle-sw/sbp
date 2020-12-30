import { useEffect, useState } from 'react';
import { utils } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import getSbpContract from './sbp';
import { useContractOwner } from './useContractOwner';
import { Header } from './Header';
import { Dashboard } from './Dashboard';
import './ConnectedDapp.css';

export const ConnectedDapp = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [eligibleBettingEvents, setEligibleBettingEvents] = useState<EligibleBettingEvent[]>([]);
  const { account } = useWeb3React<Web3Provider>();
  const owner = useContractOwner();

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
