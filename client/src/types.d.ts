type EligibleEventResponse = {
  option1: string;
  option2: string;
  payoutOdds: [number, number];
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
  payoutOdds: [number, number];
  result: number;
  startTime: BigNumber;
};

type EligibleEvents = EligibleEvent[];

type Bet = {
  amount: string;
  eventId: number;
  hash?: string;
  option: number;
  payoutOdds: [number, number];
  verified?: boolean;
};

type Bets = Bet[];

type AddBet = typeof addBet;

type ReduxState = {
  bets: {
    data: Bets;
    error: Error;
    loading: boolean;
  };
  eligibleEvents: {
    data: EligibleEvents;
    error: Error;
    loading: boolean;
  };
};
