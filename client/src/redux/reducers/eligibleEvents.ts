import { AnyAction } from 'redux';
import { GET_ELIGIBLE_EVENTS_SUCCESS } from '../actionTypes';

export default function (state = [], action: AnyAction) {
  switch (action.type) {
    case GET_ELIGIBLE_EVENTS_SUCCESS: {
      return state.concat(action.payload);
    }
    default:
      return state;
  }
}
