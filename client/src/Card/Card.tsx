import './Card.css';

type Props = {
  children: React.ReactNode;
};

export const Card = ({ children }: Props) => <div className="card">{children}</div>;
