import { EligibleEvent } from './EligibleEvent';
import './EligibleEvents.css';

type Props = {
  addBet: AddBet;
  eligibleEvents: EligibleEvents;
};

export const EligibleEvents = ({ addBet, eligibleEvents }: Props) => {
  return (
    <div className="eligible-events">
      <h3>Future Events</h3>
      <div>
        {eligibleEvents.map(
          ({ eventId, option1, option2, payoutOdds, startTime, verified }: EligibleEvent) => (
            <EligibleEvent
              addBet={addBet}
              eventId={eventId}
              key={eventId}
              option1={option1}
              option2={option2}
              payoutOdds={payoutOdds}
              startTime={startTime}
              verified={verified}
            />
          )
        )}
      </div>
    </div>
  );
};
