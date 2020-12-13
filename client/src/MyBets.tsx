import { useEffect } from 'react';
import { utils } from 'ethers';
import sbp from './sbp';
import web3 from './web3';

type Props = {
  bets: Bets[];
  setBets: (bets: Bets[]) => void;
};

export const MyBets = ({ bets, setBets }: Props) => {
  useEffect(() => {
    (async () => {
      const accounts = await web3.listAccounts();
      const response = await sbp.getUnclaimedBets();

      const bets = response
        .filter(({ bettor }: UnclaimedBetsResponse) => bettor === accounts[0])
        .map(
          ({ amount, eventId, option, payoutOdds }: UnclaimedBetsResponse) => ({
            amount: utils.formatEther(amount),
            eventId: Number(eventId),
            option: Number(option),
            payoutOdds,
          }),
        );

      setBets(bets);
    })();
  }, [setBets]);

  return (
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
};
