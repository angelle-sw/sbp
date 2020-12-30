import { GET_ELIGIBLE_EVENTS_REQUEST, GET_ELIGIBLE_EVENTS_SUCCESS } from '../actionTypes';

export const getEligibleEvents = () => ({
  type: GET_ELIGIBLE_EVENTS_REQUEST,
});

export const getEligibleEventsSuccess = (eligibleEvents: EligibleEvent[]) => ({
  payload: eligibleEvents,
  type: GET_ELIGIBLE_EVENTS_SUCCESS,
});
