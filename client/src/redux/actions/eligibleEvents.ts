import {
  ADD_EVENT_REQUEST,
  ADD_PENDING_EVENT_REQUEST,
  GET_ELIGIBLE_EVENTS_REQUEST,
  GET_ELIGIBLE_EVENTS_SUCCESS,
  VERIFY_EVENT,
} from '../actionTypes';

export const getEligibleEvents = () => ({
  type: GET_ELIGIBLE_EVENTS_REQUEST,
});

export const getEligibleEventsSuccess = (eligibleEvents: EligibleEvents) => ({
  payload: eligibleEvents,
  type: GET_ELIGIBLE_EVENTS_SUCCESS,
});

export const addEvent = (
  eventId: number,
  option1: string,
  option2: string,
  result: number,
  payoutOdds: [number, number],
  startTime: number
) => ({
  payload: {
    eventId,
    option1,
    option2,
    payoutOdds,
    result,
    startTime,
  },
  type: ADD_EVENT_REQUEST,
});

export const addPendingEvent = (
  eventId: number,
  option1: string,
  option2: string,
  result: number,
  payoutOdds: [number, number],
  startTime: number,
  hash: string
) => ({
  payload: {
    eventId,
    option1,
    option2,
    result,
    payoutOdds,
    startTime,
    verified: false,
    hash,
  },
  type: ADD_PENDING_EVENT_REQUEST,
});

export const verifyEvent = (hash: string) => ({
  payload: {
    hash,
  },
  type: VERIFY_EVENT,
});
