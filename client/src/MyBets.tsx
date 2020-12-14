type Props = {
  bets: Bets[];
};

export const MyBets = ({ bets }: Props) => (
  <div>
    My Bets
    {bets.map(({ amount, eventId, option, payoutOdds }) => (
      <div>
        <p>amount: {amount}</p>
        <p>eventId: {eventId}</p>
        <p>option: {option}</p>
        <p>
          payout odds: {payoutOdds[0]}:{payoutOdds[1]}
        </p>
      </div>
    ))}
  </div>
);
