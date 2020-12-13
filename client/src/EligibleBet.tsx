import { useState } from 'react';
import { BigNumber, utils } from 'ethers';
import sbp from './sbp';

type Props = {
  eventId: number;
  option1: string;
  option2: string;
  startTime: BigNumber;
};

export const EligibleBet = ({
  eventId,
  option1,
  option2,
  startTime,
}: Props) => {
  const [option, setOption] = useState('');
  const [amount, setAmount] = useState('');

  const placeBet = async (event: React.FormEvent) => {
    event.preventDefault();

    await sbp.placeBet(eventId, option, {
      value: utils.parseEther(amount),
    });

    setOption('');
    setAmount('');
  };

  return (
    <div>
      <form onSubmit={placeBet}>
        <p>
          <input
            type="radio"
            checked={option === '1'}
            id={`${eventId}-option1`}
            name="options"
            onChange={event => setOption(event.target.value)}
            value={1}
          />
          <label htmlFor={`${eventId}-option1`}>{option1}</label>
        </p>
        <p>
          <input
            type="radio"
            checked={option === '2'}
            id={`${eventId}-option2`}
            name="options"
            onChange={event => setOption(event.target.value)}
            value={2}
          />
          <label htmlFor={`${eventId}-option2`}>{option2}</label>
        </p>
        <p>start time: {Number(startTime)}</p>
        <div>
          <label>Amount</label>
          <input
            onChange={event => setAmount(event.target.value)}
            value={amount}
          />
          Ether
        </div>
        <button type="submit">Place Bet</button>
      </form>
    </div>
  );
};
