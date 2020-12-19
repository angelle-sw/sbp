import { useEffect } from 'react';
import { utils } from 'ethers';
import getSbpContract from './sbp';
import web3 from './web3';
import { Bets } from './Bets';
import { EligibleEvents } from './EligibleEvents';
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
        .map(
          ({ amount, eventId, option, payoutOdds }: UnclaimedBetsResponse) => ({
            amount: utils.formatEther(amount),
            eventId: Number(eventId),
            option: Number(option),
            payoutOdds,
          }),
        );

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
