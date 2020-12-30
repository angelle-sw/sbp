import { Bets } from './Bets/Bets';
import { EligibleEvents } from './EligibleEvents/EligibleEvents';
import './Dashboard.css';

type Props = {
  bets: Bet[];
  eligibleEvents: EligibleEvent[];
};

export const Dashboard = ({ bets, eligibleEvents }: Props) => (
  <div className="dashboard">
    <Bets bets={bets} />
    <EligibleEvents eligibleEvents={eligibleEvents} />
  </div>
);
