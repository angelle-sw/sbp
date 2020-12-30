import { useEffect } from 'react';
import { utils } from 'ethers';
import getSbpContract from './sbp';
import createWeb3Provider from './web3';
import { Bets } from './Bets/Bets';
import { EligibleEvents } from './EligibleEvents/EligibleEvents';
import './Dashboard.css';

type Props = {
  bets: Bet[];
  eligibleBettingEvents: EligibleBettingEvent[];
  setBets: (bets: Bet[]) => void;
  setEligibleBettingEvents: (events: EligibleBettingEvent[]) => void;
};

export const Dashboard = ({
  bets,
  eligibleBettingEvents,
  setBets,
  setEligibleBettingEvents,
}: Props) => {
  const web3 = createWeb3Provider();

  // get eligible events
  useEffect(() => {
    (async () => {
      const sbp = await getSbpContract();
      const response = await sbp.getEligibleBettingEvents();
      setEligibleBettingEvents(response);
    })();
  }, [setEligibleBettingEvents]);

  // get unclaimed bets
  useEffect(() => {
    (async () => {
      const accounts = await web3.listAccounts();
      const sbp = await getSbpContract();
      const response = await sbp.getUnclaimedBets();

      const bets = response
        .filter(({ bettor }: UnclaimedBetsResponse) => bettor === accounts[0])
        .map(({ amount, eventId, option, payoutOdds }: UnclaimedBetsResponse) => ({
          amount: utils.formatEther(amount),
          eventId: Number(eventId),
          option: Number(option),
          payoutOdds,
        }));

      setBets(bets);
    })();
  }, [setBets]);

  return (
    <div className="dashboard">
      <Bets bets={bets} />
      <EligibleEvents eligibleBettingEvents={eligibleBettingEvents} />
    </div>
  );
};
