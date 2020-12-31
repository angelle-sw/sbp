import { FiCheck } from 'react-icons/fi';
import { Option } from '../Option';
import NFLLogo from '../nfl-logo.png';
import './EligibleEventOption.css';

type Props = {
  option: string;
  selected: boolean;
};

export const EligibleEventOption = ({ option, selected }: Props) => {
  const juice = '-110';
  const spread = '-3.5';

  return (
    <Option className="selectable-option" selected={selected}>
      <div className="eligible-event-option">
        <div>{option}</div>
        {selected ? (
          <div className="event-checkmark">
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
    </Option>
  );
};
