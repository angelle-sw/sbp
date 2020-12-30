import { AnyAction } from 'redux';
import { GET_BETS_REQUEST, GET_BETS_SUCCESS } from '../actionTypes';

type State = {
  error?: Error;
  loading: boolean;
  data: UnclaimedBetsResponse[];
};

const initialState: State = {
  error: undefined,
  loading: true,
  data: [],
};

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case GET_BETS_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }

    case GET_BETS_SUCCESS: {
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
