const EMPTY_EVENT = {
  option1: '',
  option2: '',
  startTime: '0',
  result: '0'
};

const EMPTY_BET = {
  bettor: '0x0000000000000000000000000000000000000000',
  eventId: '0',
  option: '0',
  amount: '0',
  claimed: '0'
};

const isEmptyEvent = (event) => {
  for (const prop in EMPTY_EVENT) {
    if (event[prop] !== EMPTY_EVENT[prop]) {
      return false;
    }
  }

  return true;
};

const isEmptyBet = (bet) => {
  for (const prop in EMPTY_BET) {
    if (bet[prop] !== EMPTY_BET[prop]) {
      return false;
    }
  }

  return true;
};

module.exports = { isEmptyEvent, isEmptyBet };
