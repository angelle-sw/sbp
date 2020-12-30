import { Bets } from './Bets/Bets';
import { EligibleEvents } from './EligibleEvents/EligibleEvents';
import './Dashboard.css';

type Props = {
  bets: Bet[];
  eligibleBettingEvents: EligibleBettingEvent[];
};

export const Dashboard = ({ bets, eligibleBettingEvents }: Props) => (
  <div className="dashboard">
    <Bets bets={bets} />
    <EligibleEvents eligibleBettingEvents={eligibleBettingEvents} />
  </div>
);
