import './Option.css';

type Props = {
  children: React.ReactNode;
  className?: string;
  selected: boolean;
};

export const Option = ({ children, className, selected }: Props) => (
  <div className={`option ${className} ${selected && 'option-selected'}`}>{children}</div>
);
