import { EligibleEvent } from './EligibleEvent';
import './EligibleEvents.css';

type Props = {
  eligibleEvents: EligibleEvent[];
};

export const EligibleEvents = ({ eligibleEvents }: Props) => {
  return (
    <div className="eligible-events">
      <h3>Future Events</h3>
      <div>
        {eligibleEvents.map(({ eventId, option1, option2, startTime }: EligibleEvent) => (
          <EligibleEvent
            eventId={eventId}
            key={eventId}
            option1={option1}
            option2={option2}
            startTime={startTime}
          />
        ))}
      </div>
    </div>
  );
};
