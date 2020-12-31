type EligibleEventResponse = {
  option1: string;
  option2: string;
  payoutOdds: [number, number];
  result: number;
  startTime: BigNumber;
};

type UnclaimedBetsResponse = {
  amount: string;
  bettor: string;
  eventId: number;
  option: number;
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

type Bet = {
  amount: string;
  eventId: number;
  hash?: string;
  option: number;
  payoutOdds: [number, number];
  verified?: boolean;
};

type NewBet = {
  amount: string;
  eventId: number;
  option: number;
};

type AddBet = (
  eventId: number,
  option: string,
  amount: BigNumber,
  payoutOdds: [number, number]
) => void;

type AddVerifiedBet = (
  amount: BigNumber,
  bettor: string,
  eventId: BigNumber,
  option: BigNumber,
  payoutOdds: [number, number]
) => void;

type PendingBet = {
  amount: BigNumber;
  eventId: number;
  option: number;
  payoutOdds: [number, number];
};

type ReduxState = {
  bets: {
    data: Bet[];
    error: Error;
    loading: boolean;
  };
  eligibleEvents: {
    data: EligibleEvent[];
    error: Error;
    loading: boolean;
  };
};
