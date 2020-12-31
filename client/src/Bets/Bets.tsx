import { Bet } from './Bet';
import './Bets.css';

type Props = {
  bets: Bets;
};

export const Bets = ({ bets }: Props) => (
  <div className="bets">
    <h3>My Bets</h3>
    <div>
      {bets.map(({ amount, eventId, option, payoutOdds, verified }, index) => (
        <Bet
          amount={amount}
          eventId={eventId}
          key={index}
          option={option}
          payoutOdds={payoutOdds}
          verified={verified}
        />
      ))}
    </div>
  </div>
);
