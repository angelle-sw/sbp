import { FiCheck } from 'react-icons/fi';
import { Option } from '../Option';
import NFLLogo from '../nfl-logo.png';
import './BetOption.css';

type Props = {
  option?: string;
  payoutOdds: [number, number];
  selected: boolean;
  verified?: boolean;
};

export const BetOption = ({ option, payoutOdds, selected, verified }: Props) => {
  return (
    <Option selected={selected} verified={verified}>
      <div className={`bet-option ${selected ? '' : 'shadowed'}`}>
        <div>{option}</div>
        {selected ? (
          <div
            className={`bet-checkmark ${
              verified === false ? 'bet-checkmark-pending' : 'bet-checkmark-verified'
            }`}
          >
            <FiCheck />
          </div>
        ) : (
          <div />
        )}
        <div className="logo">
          <img src={NFLLogo} alt="team-logo" />
        </div>
        <div className="odds">
          <span>
            {payoutOdds[0]}:{payoutOdds[1]}
          </span>
          <span>-110</span>
        </div>
      </div>
    </Option>
  );
};
