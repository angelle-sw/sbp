import { all, takeEvery } from 'redux-saga/effects';
import { ADD_BET_REQUEST, GET_BETS_REQUEST, GET_ELIGIBLE_EVENTS_REQUEST } from '../actionTypes';
import { addBet, getBets } from './bets';
import { getEligibleEvents } from './eligibleEvents';

export default function* rootSaga() {
  yield all([
    yield takeEvery(ADD_BET_REQUEST, addBet),
    yield takeEvery(GET_BETS_REQUEST, getBets),
    yield takeEvery(GET_ELIGIBLE_EVENTS_REQUEST, getEligibleEvents),
  ]);
}
