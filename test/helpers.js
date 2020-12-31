const { constants } = require('@openzeppelin/test-helpers');

const EMPTY_EVENT = {
  eventType: '',
  option1Name: '',
  option1PayoutOdds: '0',
  option2Name: '',
  option2PayoutOdds: '0',
  startTime: '0',
  result: '0',
};

const EMPTY_BET = {
  bettor: constants.ZERO_ADDRESS,
  eventId: '0',
  option: '0',
  amount: '0',
  claimed: '0',
};

const isEmptyObject = (obj, emptyObjFixture) => {
  for (const prop in emptyObjFixture) {
    if (obj[prop] !== emptyObjFixture[prop]) {
      return false;
    }
  }

  return true;
};

const isEmptyEvent = event => isEmptyObject(event, EMPTY_EVENT);
const isEmptyBet = bet => isEmptyObject(bet, EMPTY_BET);

module.exports = { isEmptyEvent, isEmptyBet };
