import getSbpContract from '../../sbp';
import { getBetsSuccess, getEligibleEventsSuccess } from '../actions';
import { GET_BETS_REQUEST, GET_ELIGIBLE_EVENTS_REQUEST } from '../actionTypes';
import { all, call, put, takeEvery } from 'redux-saga/effects';

export function* getBets() {
  const sbpContract = yield call(getSbpContract);
  const unclaimedBets = yield call(sbpContract.getUnclaimedBets);

  yield put(getBetsSuccess(unclaimedBets));
}

export function* watchGetBets() {
  yield takeEvery(GET_BETS_REQUEST, getBets);
}

export function* getEligibleEvents() {
  const sbpContract = yield call(getSbpContract);
  const eligibleEvents = yield call(sbpContract.getEligibleBettingEvents);

  yield put(getEligibleEventsSuccess(eligibleEvents));
}

export function* watchGetEligibleEvents() {
  yield takeEvery(GET_ELIGIBLE_EVENTS_REQUEST, getEligibleEvents);
}

export default function* rootSaga() {
  yield all([watchGetBets(), watchGetEligibleEvents()]);
}
