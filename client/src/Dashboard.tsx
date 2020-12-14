import { useEffect } from 'react';
import { utils } from 'ethers';
import sbp from './sbp';
import web3 from './web3';
import { MyBets } from './MyBets';
import { EligibleBets } from './EligibleBets';

type Props = {
  bets: Bets[];
  eligibleBettingEvents: EligibleBettingEvent[];
  setBets: (bets: Bets[]) => void;
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
      const response = await sbp.getEligibleBettingEvents();
      setEligibleBettingEvents(response);
    })();
  }, [setEligibleBettingEvents]);

  // get unclaimed bets
  useEffect(() => {
    (async () => {
      const accounts = await web3.listAccounts();
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
      <MyBets bets={bets} />
      <EligibleBets eligibleBettingEvents={eligibleBettingEvents} />
    </div>
  );
};
