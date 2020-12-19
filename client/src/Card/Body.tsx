import './Body.css';

type Props = {
  children: React.ReactNode;
};

export const Body = ({ children }: Props) => (
  <div className="card-body">{children}</div>
);
