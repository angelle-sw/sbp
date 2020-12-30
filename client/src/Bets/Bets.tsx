import { Bet } from './Bet';
import './Bets.css';

type Props = {
  bets: Bet[];
};

export const Bets = ({ bets }: Props) => (
  <div className="bets">
    <h3>My Bets</h3>
    <div>
      {bets.map(({ amount, eventId, option, payoutOdds }) => (
        <Bet
          amount={amount}
          eventId={eventId}
          key={eventId}
          option={option}
          payoutOdds={payoutOdds}
        />
      ))}
    </div>
  </div>
);
