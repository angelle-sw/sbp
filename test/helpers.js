const { constants } = require('@openzeppelin/test-helpers');

const EMPTY_EVENT = {
  option1: '',
  option2: '',
  startTime: '0',
  result: '0'
};

const EMPTY_BET = {
  bettor: constants.ZERO_ADDRESS,
  eventId: '0',
  option: '0',
  amount: '0',
  claimed: '0'
};

const isEmptyObject = (obj, emptyObjFixture) => {
  for (const prop in emptyObjFixture) {
    if (obj[prop] !== emptyObjFixture[prop]) {
      return false;
    }
  }

  return true;
};

const isEmptyEvent = (event) => isEmptyObject(event, EMPTY_EVENT);
const isEmptyBet = (bet) => isEmptyObject(bet, EMPTY_BET);

module.exports = { isEmptyEvent, isEmptyBet };
