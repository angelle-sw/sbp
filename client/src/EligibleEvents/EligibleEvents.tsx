import { EligibleEvent } from './EligibleEvent';
import './EligibleEvents.css';

type Props = {
  eligibleBettingEvents: EligibleBettingEvent[];
};

export const EligibleEvents = ({ eligibleBettingEvents }: Props) => {
  return (
    <div className="eligible-events">
      <h3>Future Events</h3>
      <div>
        {eligibleBettingEvents.map(
          ({ eventId, option1, option2, startTime }: EligibleBettingEvent) => (
            <EligibleEvent
              eventId={eventId}
              key={eventId}
              option1={option1}
              option2={option2}
              startTime={startTime}
            />
          )
        )}
      </div>
    </div>
  );
};
