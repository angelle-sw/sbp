import { useMemo, useState } from 'react';
import { BigNumber, utils } from 'ethers';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns-tz/format';
import sbp from './sbp';
import { EligibleBetCard } from './EligibleBetCard';
import './EligibleBet.css';

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

  const formattedDate = useMemo(() => {
    const result = fromUnixTime(Number(startTime));
    return format(result, 'MMMM d, Y @ h:mm a zzz');
  }, [startTime]);

  return (
    <div>
      <form onSubmit={placeBet}>
        <div className="eligible-bet-card">
          <span className="eligible-bet-datetime">{formattedDate}</span>
          <div className="eligible-bet-options">
            <div
              className={`eligible-bet-option-radio ${
                option === '1' ? 'selected' : ''
              }`}
            >
              <label htmlFor={`${eventId}-option1`}>
                <input
                  type="radio"
                  checked={option === '1'}
                  id={`${eventId}-option1`}
                  name="options"
                  onChange={event => setOption(event.target.value)}
                  value={1}
                />
                <EligibleBetCard option={option1} selected={option === '1'} />
              </label>
            </div>
            <div
              className={`eligible-bet-option-radio ${
                option === '2' ? 'selected' : ''
              }`}
            >
              <label htmlFor={`${eventId}-option2`}>
                <input
                  type="radio"
                  checked={option === '2'}
                  id={`${eventId}-option2`}
                  name="options"
                  onChange={event => setOption(event.target.value)}
                  value={2}
                />
                <EligibleBetCard option={option2} selected={option === '2'} />
              </label>
            </div>
          </div>
          <div className="eligible-bet-inputs">
            <div className="eligible-bet-amount">
              <input
                onChange={event => setAmount(event.target.value)}
                placeholder="ex: 1.2"
                value={amount}
              />
              <span>ETH</span>
            </div>
            <button className="eligible-bet-submit-button" type="submit">
              Place Bet
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
