import './Footer.css';

type Props = {
  children: React.ReactNode;
};

export const Footer = ({ children }: Props) => (
  <div className="card-footer">{children}</div>
);
