import { AnyAction } from 'redux';
import {
  ADD_PENDING_BET_REQUEST,
  GET_BETS_REQUEST,
  GET_BETS_SUCCESS,
  VERIFY_BET,
} from '../actionTypes';

type State = {
  error?: Error;
  loading: boolean;
  data: Bet[];
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

    case ADD_PENDING_BET_REQUEST: {
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    }

    case VERIFY_BET: {
      const { hash } = action.payload;
      const mapped = state.data.map(bet => {
        if (bet.hash === hash) {
          return {
            ...bet,
            verified: true,
          };
        }

        return bet;
      });

      return {
        ...state,
        data: [...mapped],
      };
    }

    default:
      return state;
  }
}
