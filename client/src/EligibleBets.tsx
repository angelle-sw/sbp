import { EligibleBet } from './EligibleBet';

type Props = {
  eligibleBettingEvents: EligibleBettingEvent[];
};

export const EligibleBets = ({ eligibleBettingEvents }: Props) => {
  return (
    <div>
      Future Events
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
