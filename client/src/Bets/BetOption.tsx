import { FiCheck } from 'react-icons/fi';
import { Option } from '../Option/Option';
import NFLLogo from '../nfl-logo.png';
import './BetOption.css';

type Props = {
  option: string;
  payoutOdds: [number, number];
  selected: boolean;
};

export const BetOption = ({ option, payoutOdds, selected }: Props) => {
  return (
    <Option selected={selected}>
      <div className={`bet-option ${selected ? '' : 'shadowed'}`}>
        <div>{option}</div>
        {selected ? (
          <div className="checkmark">
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
