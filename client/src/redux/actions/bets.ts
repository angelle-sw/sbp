import { GET_BETS_REQUEST, GET_BETS_SUCCESS } from '../actionTypes';

export const getBets = () => ({
  type: GET_BETS_REQUEST,
});

export const getBetsSuccess = (unclaimedBets: UnclaimedBetsResponse) => ({
  payload: unclaimedBets,
  type: GET_BETS_SUCCESS,
});
