import { useEffect } from 'react';
import sbp from './sbp';
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
  useEffect(() => {
    (async () => {
      const response = await sbp.getEligibleBettingEvents();
      setEligibleBettingEvents(response);
    })();
  }, [setEligibleBettingEvents]);

  return (
    <div className="dashboard">
      <MyBets bets={bets} setBets={setBets} />
      <EligibleBets eligibleBettingEvents={eligibleBettingEvents} />
    </div>
  );
};
