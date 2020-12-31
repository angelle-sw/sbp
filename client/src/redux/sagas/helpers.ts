import { utils } from 'ethers';

export const processBets = (bets: UnclaimedBetsResponse[]) =>
  bets
    .filter(({ bettor }: { bettor?: string }) => bettor)
    .map(({ amount, eventId, option, payoutOdds }: UnclaimedBetsResponse) => ({
      amount: utils.formatEther(amount),
      eventId: Number(eventId),
      option: Number(option),
      payoutOdds,
    }));

export const processEvents = (eligibleEvents: EligibleEvents) =>
  eligibleEvents.map(
    (
      { option1, option2, payoutOdds, result, startTime }: EligibleEventResponse,
      index: number
    ) => ({
      eventId: index,
      option1: option1,
      option2: option2,
      payoutOdds,
      result: Number(result),
      startTime: Number(startTime),
    })
  );
