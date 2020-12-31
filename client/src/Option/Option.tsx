import './Option.css';

type Props = {
  children: React.ReactNode;
  className?: string;
  selected: boolean;
  verified?: boolean;
};

const computeClassName = (selected: boolean, verified?: boolean) => {
  if (selected) {
    if (verified !== false) {
      return 'option-selected';
    } else {
      return 'option-selected-pending';
    }
  }
};

export const Option = ({ children, className, selected, verified }: Props) => (
  <div className={`option ${className} ${computeClassName(selected, verified)}`}>{children}</div>
);
