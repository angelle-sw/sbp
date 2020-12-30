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
};

export const Bet = ({ amount, eventId, option, payoutOdds }: Props) => {
  const [event, setEvent] = useState<EligibleEvent>();

  useEffect(() => {
    (async () => {
      const sbp = await getSbpContract();

      const { option1, option2, result, startTime } = await sbp.getEvent(eventId);
      setEvent({ eventId: 100, option1, option2, result, startTime: Number(startTime) });
    })();
  }, [eventId]);

  const formattedDate = useMemo(() => {
    if (event) {
      const result = fromUnixTime(Number(event.startTime));
      return format(result, 'MMMM d, Y @ h:mm a zzz');
    }
  }, [event]);

  if (event) {
    return (
      <Card>
        <CardHeader>{formattedDate}</CardHeader>
        <CardBody>
          <BetOption option={event.option1} payoutOdds={payoutOdds} selected={option === 1} />
          <BetOption option={event.option2} payoutOdds={payoutOdds} selected={option === 2} />
        </CardBody>
        <CardFooter>
          <span>amount: {amount}</span>
        </CardFooter>
      </Card>
    );
  }

  return null;
};
