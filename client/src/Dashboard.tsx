import { useEffect, useState } from 'react';
import sbp from './sbp';
import { MyBets } from './MyBets';
import { EligibleBets } from './EligibleBets';

type Props = {
  bets: Bets[];
  setBets: (bets: Bets[]) => void;
};

export const Dashboard = ({ bets, setBets }: Props) => {
  const [eligibleBettingEvents, setEligibleBettingEvents] = useState<
    EligibleBettingEvent[]
  >([]);

  useEffect(() => {
    (async () => {
      const response = await sbp.getEligibleBettingEvents();
      setEligibleBettingEvents(response);
    })();
  }, []);

  return (
    <div className="dashboard">
      <MyBets bets={bets} setBets={setBets} />
      <EligibleBets eligibleBettingEvents={eligibleBettingEvents} />
    </div>
  );
};
