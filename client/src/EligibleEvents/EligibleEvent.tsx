import { useMemo, useState } from 'react';
import { BigNumber, utils } from 'ethers';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns-tz/format';
import getSbpContract from '../sbp';
import { Card, CardHeader, CardBody, CardFooter } from '../Card';
import { EligibleEventOption } from './EligibleEventOption';
import './EligibleEvent.css';

type Props = {
  eventId: number;
  option1: string;
  option2: string;
  startTime: BigNumber;
};

export const EligibleEvent = ({ eventId, option1, option2, startTime }: Props) => {
  const [option, setOption] = useState('');
  const [amount, setAmount] = useState('');

  const placeBet = async (event: React.FormEvent) => {
    event.preventDefault();
    const sbp = await getSbpContract();

    await sbp.placeBet(eventId, option, {
      value: utils.parseEther(amount),
    });

    setOption('');
    setAmount('');
  };

  const formattedDate = useMemo(() => {
    const result = fromUnixTime(Number(startTime));
    return format(result, 'MMMM d, Y @ h:mm a zzz');
  }, [startTime]);

  const handleOption = (value: string) => {
    if (value === option) {
      setOption('');
    } else {
      setOption(value);
    }
  };

  return (
    <div>
      <form onSubmit={placeBet}>
        <Card>
          <CardHeader>{formattedDate}</CardHeader>
          <CardBody>
            <label htmlFor={`${eventId}-option1`}>
              <input
                className="eligible-event-radio"
                type="checkbox"
                checked={option === '1'}
                id={`${eventId}-option1`}
                onChange={event => handleOption(event.target.value)}
                value={1}
              />
              <EligibleEventOption option={option1} selected={option === '1'} />
            </label>
            <label htmlFor={`${eventId}-option2`}>
              <input
                className="eligible-event-radio"
                type="checkbox"
                checked={option === '2'}
                id={`${eventId}-option2`}
                onChange={event => handleOption(event.target.value)}
                value={2}
              />
              <EligibleEventOption option={option2} selected={option === '2'} />
            </label>
          </CardBody>
          <CardFooter>
            <div className="eligible-event-amount">
              <input
                onChange={event => setAmount(event.target.value)}
                placeholder="ex: 1.2"
                value={amount}
              />
              <span>DAI</span>
            </div>
            <button className="eligible-event-submit-button" type="submit">
              Place Bet
            </button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
