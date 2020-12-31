import { useEffect, useMemo, useState } from 'react';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns-tz/format';
import { Card, CardHeader, CardBody, CardFooter } from '../Card';
import { BetOption } from './BetOption';
import getSbpContract from '../sbp';

type Props = {
  amount: string;
  eventId: number;
  option: number;
  payoutOdds: [number, number];
  verified?: boolean;
};

type Event = {
  eventId: number;
  option1: string;
  option2: string;
  startTime: number;
};

export const Bet = ({ amount, eventId, option, payoutOdds, verified }: Props) => {
  const [event, setEvent] = useState<Event>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const sbp = await getSbpContract();

      const { option1, option2, startTime } = await sbp.getEvent(eventId);
      setEvent({
        eventId,
        option1,
        option2,
        startTime: Number(startTime),
      });
    })();
    setLoading(false);
  }, [eventId]);

  const formattedDate = useMemo(() => {
    if (event) {
      const result = fromUnixTime(Number(event.startTime));
      return format(result, 'MMMM d, Y @ h:mm a zzz');
    }
  }, [event]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>{formattedDate}</CardHeader>
      <CardBody>
        <BetOption
          option={event?.option1}
          payoutOdds={payoutOdds}
          selected={option === 1}
          verified={verified}
        />
        <BetOption
          option={event?.option2}
          payoutOdds={payoutOdds}
          selected={option === 2}
          verified={verified}
        />
      </CardBody>
      <CardFooter>
        <span>amount: {amount}</span>
      </CardFooter>
    </Card>
  );
};
