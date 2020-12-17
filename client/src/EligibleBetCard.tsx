import { FiCheck } from 'react-icons/fi';
import NFLLogo from './nfl-logo.png';

type Props = {
  option: string;
  selected: boolean;
};

export const EligibleBetCard = ({ option, selected }: Props) => {
  const juice = '-110';
  const spread = '-3.5';
  return (
    <div className="eligible-bet-option-card">
      <div>
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
          <span>{juice}</span>
          <span>{spread}</span>
        </div>
      </div>
    </div>
  );
};
