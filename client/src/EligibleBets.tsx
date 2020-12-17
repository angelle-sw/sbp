import { EligibleBet } from './EligibleBet';
import './EligibleBets.css';

type Props = {
  eligibleBettingEvents: EligibleBettingEvent[];
};

export const EligibleBets = ({ eligibleBettingEvents }: Props) => {
  return (
    <div className="eligible-bets">
      {eligibleBettingEvents.map(
        ({ option1, option2, startTime }: EligibleBettingEvent, index) => (
          <EligibleBet
            eventId={index}
            option1={option1}
            option2={option2}
            startTime={startTime}
          />
        ),
      )}
    </div>
  );
};
