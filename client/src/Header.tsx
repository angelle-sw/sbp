import { useNavigate } from 'react-router-dom';

type Props = {
  account?: string | null;
  owner?: string;
};

export const Header = ({ account, owner }: Props) => {
  const navigate = useNavigate();

  console.log(account, owner);

  return (
    <div>
      Header
      {account === owner && (
        <button onClick={() => navigate('/add-event')} type="button">
          Add Event
        </button>
      )}
    </div>
  );
};
