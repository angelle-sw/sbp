import { AnyAction } from 'redux';
import { call, put } from 'redux-saga/effects';
import { utils } from 'ethers';
import getSbpContract from '../../sbp';
import { addPendingBet, getBetsSuccess } from '../actions';
import { processBets } from './helpers';

export function* getBets() {
  const sbpContract = yield call(getSbpContract);
  const unclaimedBets = yield call(sbpContract.getUnclaimedBets);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  yield put(getBetsSuccess(processBets(unclaimedBets)));
}

export function* addBet(action: AnyAction) {
  const { amount, eventId, option, payoutOdds } = action.payload;

  const sbpContract = yield call(getSbpContract);
  const response = yield call(sbpContract.placeBet, eventId, option, { value: amount });

  yield put(
    addPendingBet(eventId, Number(option), utils.formatEther(amount), payoutOdds, response.hash)
  );
}
