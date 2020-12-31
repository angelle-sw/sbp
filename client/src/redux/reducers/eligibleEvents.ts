import { AnyAction } from 'redux';
import {
  ADD_PENDING_EVENT_REQUEST,
  GET_ELIGIBLE_EVENTS_REQUEST,
  GET_ELIGIBLE_EVENTS_SUCCESS,
  VERIFY_EVENT,
} from '../actionTypes';

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

    case ADD_PENDING_EVENT_REQUEST: {
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    }

    case VERIFY_EVENT: {
      const { hash } = action.payload;
      const mapped = state.data.map(event => {
        if (event.hash === hash) {
          return {
            ...event,
            verified: true,
          };
        }

        return event;
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
