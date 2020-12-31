import { all, takeEvery } from 'redux-saga/effects';
import {
  ADD_BET_REQUEST,
  ADD_EVENT_REQUEST,
  GET_BETS_REQUEST,
  GET_ELIGIBLE_EVENTS_REQUEST,
} from '../actionTypes';
import { addBet, getBets } from './bets';
import { addEvent, getEligibleEvents } from './eligibleEvents';

export default function* rootSaga() {
  yield all([
    yield takeEvery(ADD_BET_REQUEST, addBet),
    yield takeEvery(ADD_EVENT_REQUEST, addEvent),
    yield takeEvery(GET_BETS_REQUEST, getBets),
    yield takeEvery(GET_ELIGIBLE_EVENTS_REQUEST, getEligibleEvents),
  ]);
}
