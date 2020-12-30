type EligibleEventResponse = {
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

type EligibleEvent = {
  eventId: number;
  option1: string;
  option2: string;
  result: number;
  startTime: BigNumber;
};

type Bet = {
  amount: string;
  eventId: number;
  option: number;
  payoutOdds: [number, number];
};

type ReduxState = {
  bets: {
    data: UnclaimedBetsResponse[];
    error: Error;
    loading: boolean;
  };
  eligibleEvents: {
    data: EligibleEventResponse[];
    error: Error;
    loading: boolean;
  };
};
