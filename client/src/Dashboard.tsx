import { useEffect, useState } from 'react';
import sbp from './sbp';
import { MyBets } from './MyBets';
import { EligibleBets } from './EligibleBets';

export const Dashboard = () => {
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
      <MyBets />
      <EligibleBets eligibleBettingEvents={eligibleBettingEvents} />
    </div>
  );
};
