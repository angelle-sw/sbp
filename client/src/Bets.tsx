import { SingleBet } from './SingleBet';
import './Bets.css';

type Props = {
  bets: Bet[];
};

export const Bets = ({ bets }: Props) => (
  <div className="bets">
    <h3>My Bets</h3>
    <div>
      {bets.map(({ amount, eventId, option, payoutOdds }) => (
        <SingleBet
          amount={amount}
          eventId={eventId}
          option={option}
          payoutOdds={payoutOdds}
        />
      ))}
    </div>
  </div>
);
