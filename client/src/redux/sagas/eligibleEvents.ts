import getSbpContract from '../../sbp';
import { getEligibleEventsSuccess } from '../actions';
import { processEvents } from './helpers';
import { call, put } from 'redux-saga/effects';

export function* getEligibleEvents() {
  const sbpContract = yield call(getSbpContract);
  const eligibleEvents = yield call(sbpContract.getEligibleBettingEvents);

  yield put(getEligibleEventsSuccess(processEvents(eligibleEvents)));
}
