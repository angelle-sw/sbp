type EligibleBettingEvent = {
  option1: string;
  option2: string;
  result: number;
  startTime: BigNumber;
};

type UnclaimedBetsResponse = {
  amount: BigNumber;
  bettor: string;
  eventId: BigNumber;
  option: BigNumber;
  payoutOdds: [number, number];
};
