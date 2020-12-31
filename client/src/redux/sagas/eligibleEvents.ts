import { AnyAction } from 'redux';
import { call, put } from 'redux-saga/effects';
import getSbpContract from '../../sbp';
import { addPendingEvent, getEligibleEventsSuccess } from '../actions';
import { processEvents } from './helpers';

export function* getEligibleEvents() {
  const sbpContract = yield call(getSbpContract);
  const eligibleEvents = yield call(sbpContract.getEligibleBettingEvents);

  yield put(getEligibleEventsSuccess(processEvents(eligibleEvents)));
}

export function* addEvent(action: AnyAction) {
  const { eventId, option1, option2, payoutOdds, result, startTime } = action.payload;

  const sbpContract = yield call(getSbpContract);
  const response = yield call(sbpContract.addEvent, option1, option2, startTime);

  yield put(
    addPendingEvent(eventId, option1, option2, result, payoutOdds, startTime, response.hash)
  );
}
