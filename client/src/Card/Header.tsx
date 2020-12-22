import './Header.css';

type Props = {
  children: React.ReactNode;
};

export const Header = ({ children }: Props) => <span className="card-header">{children}</span>;
