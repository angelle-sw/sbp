import { Bets } from './Bets/Bets';
import { EligibleEvents } from './EligibleEvents/EligibleEvents';
import './Dashboard.css';

type Props = {
  addBet: AddBet;
  bets: Bets;
  eligibleEvents: EligibleEvents;
};

export const Dashboard = ({ addBet, bets, eligibleEvents }: Props) => (
  <div className="dashboard">
    <Bets bets={bets} />
    <EligibleEvents addBet={addBet} eligibleEvents={eligibleEvents} />
  </div>
);
