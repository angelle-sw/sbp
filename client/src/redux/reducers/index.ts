import { combineReducers } from 'redux';
import bets from './bets';
import eligibleEvents from './eligibleEvents';

export default combineReducers({ bets, eligibleEvents });
