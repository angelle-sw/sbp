import { BigNumber } from 'ethers';
import {
  ADD_BET_REQUEST,
  ADD_BET_SUCCESS,
  ADD_PENDING_BET_REQUEST,
  GET_BETS_REQUEST,
  GET_BETS_SUCCESS,
  VERIFY_BET,
} from '../actionTypes';

export const getBets = () => ({
  type: GET_BETS_REQUEST,
});

export const getBetsSuccess = (unclaimedBets: UnclaimedBetsResponse[]) => ({
  payload: unclaimedBets,
  type: GET_BETS_SUCCESS,
});

export const addBet = (
  eventId: number,
  option: number,
  amount: BigNumber,
  payoutOdds: [number, number]
) => ({
  payload: {
    eventId,
    option,
    amount,
    payoutOdds,
  },
  type: ADD_BET_REQUEST,
});

export const addPendingBet = (
  eventId: number,
  option: number,
  amount: string,
  payoutOdds: [number, number],
  hash: string
) => ({
  payload: {
    amount,
    eventId,
    option,
    payoutOdds,
    verified: false,
    hash,
  },
  type: ADD_PENDING_BET_REQUEST,
});

export const addBetSuccess = (unclaimedBets: UnclaimedBetsResponse) => ({
  payload: unclaimedBets,
  type: ADD_BET_SUCCESS,
});

export const verifyBet = (hash: string) => ({
  payload: {
    hash,
  },
  type: VERIFY_BET,
});
