import { createSelector } from 'reselect';
import { utils } from 'ethers';

const getBets = (state: ReduxState) => state.bets;

export const transformBets = createSelector([getBets], bets => {
  return bets
    .filter(({ bettor }: UnclaimedBetsResponse) => bettor)
    .map(({ amount, eventId, option, payoutOdds }: UnclaimedBetsResponse) => ({
      amount: utils.formatEther(amount),
      eventId: Number(eventId),
      option: Number(option),
      payoutOdds,
    }));
});
