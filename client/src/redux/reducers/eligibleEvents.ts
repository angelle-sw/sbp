import { AnyAction } from 'redux';
import { GET_ELIGIBLE_EVENTS_REQUEST, GET_ELIGIBLE_EVENTS_SUCCESS } from '../actionTypes';

type State = {
  error?: Error;
  loading: boolean;
  data: EligibleEvents;
};

const initialState: State = {
  error: undefined,
  loading: true,
  data: [],
};

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case GET_ELIGIBLE_EVENTS_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }

    case GET_ELIGIBLE_EVENTS_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        error: undefined,
        loading: false,
      };
    }

    default:
      return state;
  }
}
