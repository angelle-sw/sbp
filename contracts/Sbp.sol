// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Sbp is Ownable {
  using SafeMath for uint;

  Event[] public events;
  Bet[] public bets;

  // Hardcode 1:1 initial payout odds for now
  uint public initialPayoutOdds = 10000;

  // Since Solidity does not support fixed point numbers, a scale factor is used to scale up the
  // payout odd factors when calculating the payout amount
  uint scaleFactor = 1000000;

  struct Event {
    string eventType;
    string option1Name;
    uint option1PayoutOdds;
    string option2Name;
    uint option2PayoutOdds;
    uint64 startTime;
    uint8 result;
  }

  struct Bet {
    address payable bettor;
    uint eventId;
    uint option;
    uint payoutOdds;
    uint amount;
    uint8 claimed;
  }

  event NewEvent(uint id, string eventType, string option1Name, uint option1PayoutOdds, string option2Name, uint option2PayoutOdds, uint64 startTime, uint8 result);
  event NewBet(uint id, address bettor, uint eventId, uint option, uint payoutOdds, uint amount, uint8 claimed);
  event NewEventResult(uint id, uint8 result);

  function balanceOf() external view returns(uint) {
    return address(this).balance;
  }

  function addEvent(string memory _eventType, string memory _option1Name, string memory _option2Name, uint64 _startTime) external onlyOwner {
    uint eventId = events.length;

    Event memory newEvent = Event(_eventType, _option1Name, initialPayoutOdds, _option2Name, initialPayoutOdds, _startTime, 0);
    events.push(newEvent);

    emit NewEvent(eventId, _eventType, _option1Name, initialPayoutOdds, _option2Name, initialPayoutOdds, _startTime, 0);
  }

  function getEvent(uint _eventId) public view returns(Event memory) {
    return events[_eventId];
  }

  function getEvents() public view returns(Event[] memory) {
    return events;
  }

  function getEligibleBettingEvents() external view returns(Event[] memory) {
    Event[] memory eligibleBettingEvents = new Event[](events.length);
    uint index = 0;

    for (uint32 i = 0; i < events.length; i++) {
      if (events[i].startTime > block.timestamp) {
        eligibleBettingEvents[index] = events[i];
        index++;
      }
    }

    return eligibleBettingEvents;
  }

  function setEventResult(uint _eventId, uint8 _result) external onlyOwner {
    events[_eventId].result = _result;

    emit NewEventResult(_eventId, _result);
  }

  function adjustEventPayoutOdds(uint _eventId) internal {
    Event storage bettingEvent = events[_eventId];

    uint option1TotalAmountWagered = 0;
    uint option1TotalPayoutAmount = 0;
    uint option2TotalAmountWagered = 0;
    uint option2TotalPayoutAmount = 0;

    for (uint32 i = 0; i < bets.length; i++) {
      Bet memory bet = bets[i];

      if (bet.eventId == _eventId) {
        if (bet.option == 1) {
          option1TotalPayoutAmount += calculateBetPayoutAmount(bet);
          option1TotalAmountWagered = bet.amount;
        }
        else if (bet.option == 2) {
          option2TotalPayoutAmount += calculateBetPayoutAmount(bet);
          option2TotalAmountWagered = bet.amount;
        }
      }
    }

    uint oneEther = 1000000000000000000;
    uint totalPayoutAmount = SafeMath.add(option1TotalPayoutAmount, option2TotalPayoutAmount);
    uint option1PayoutWeight = 0;
    uint option2PayoutWeight = 0;
    uint payoutOddsAdjustmentCeiling = 1;

    if (totalPayoutAmount > SafeMath.mul(oneEther, 10000)) {
      payoutOddsAdjustmentCeiling = 100000000;
    }
    if (totalPayoutAmount > SafeMath.mul(oneEther, 1000)) {
      payoutOddsAdjustmentCeiling = 10000000;
    }
    else if (totalPayoutAmount > SafeMath.mul(oneEther, 100)) {
      payoutOddsAdjustmentCeiling = 1000000;
    }
    else if (totalPayoutAmount > SafeMath.mul(oneEther, 10)) {
      payoutOddsAdjustmentCeiling = 100000;
    }
    else if (totalPayoutAmount > oneEther) {
      payoutOddsAdjustmentCeiling = 10000;
    }
    else if (totalPayoutAmount > SafeMath.div(oneEther, 10)) {
      payoutOddsAdjustmentCeiling = 1000;
    }

    if (option1TotalAmountWagered >= option2TotalAmountWagered) {
      option1PayoutWeight = SafeMath.div(option1TotalAmountWagered, SafeMath.add(option2TotalAmountWagered, 1));
      option2PayoutWeight = SafeMath.mul(option1TotalAmountWagered, option2TotalAmountWagered);
    }
    else {
      option1PayoutWeight = SafeMath.mul(option1TotalAmountWagered, option2TotalAmountWagered);
      option2PayoutWeight = SafeMath.div(option2TotalAmountWagered, SafeMath.add(option1TotalAmountWagered, 1));
    }

    if (option1PayoutWeight > bettingEvent.option1PayoutOdds) {
      uint absoluteDifference = SafeMath.sub(option1PayoutWeight, bettingEvent.option1PayoutOdds);
      uint option1PayoutOddsAdjustment = absoluteDifference < payoutOddsAdjustmentCeiling ? absoluteDifference : payoutOddsAdjustmentCeiling;

      bettingEvent.option1PayoutOdds -= option1PayoutOddsAdjustment;
    } else {
      uint absoluteDifference = SafeMath.sub(bettingEvent.option1PayoutOdds, option1PayoutWeight);
      uint option1PayoutOddsAdjustment = absoluteDifference < payoutOddsAdjustmentCeiling ? absoluteDifference : payoutOddsAdjustmentCeiling;

      bettingEvent.option1PayoutOdds += option1PayoutOddsAdjustment;
    }

    if (option2PayoutWeight > bettingEvent.option2PayoutOdds) {
      uint absoluteDifference = SafeMath.sub(option2PayoutWeight, bettingEvent.option2PayoutOdds);
      uint option2PayoutOddsAdjustment = absoluteDifference < payoutOddsAdjustmentCeiling ? absoluteDifference : payoutOddsAdjustmentCeiling;

      bettingEvent.option2PayoutOdds -= option2PayoutOddsAdjustment;
    } else {
      uint absoluteDifference = SafeMath.sub(bettingEvent.option2PayoutOdds, option2PayoutWeight);
      uint option2PayoutOddsAdjustment = absoluteDifference < payoutOddsAdjustmentCeiling ? absoluteDifference : payoutOddsAdjustmentCeiling;

      bettingEvent.option2PayoutOdds += option2PayoutOddsAdjustment;
    }
  }

  function placeBet(uint _eventId, uint _option) external payable {
    require(events[_eventId].startTime > block.timestamp, "Bets cannot be placed after event has started");

    Event memory bettingEvent = events[_eventId];
    uint betId = bets.length;
    uint payoutOdds = _option == 1 ? bettingEvent.option1PayoutOdds : bettingEvent.option2PayoutOdds;

    Bet memory bet = Bet(msg.sender, _eventId, _option, payoutOdds, msg.value, 0);
    bets.push(bet);

    adjustEventPayoutOdds(_eventId);

    emit NewBet(betId, msg.sender, _eventId, _option, payoutOdds, msg.value, 0);
  }

  function getBet(uint _betId) public view returns(Bet memory) {
    return bets[_betId];
  }

  function getBets() public view returns(Bet[] memory) {
    return bets;
  }

  function getUnclaimedBets() external view returns(Bet[] memory) {
    Bet[] memory placedBets = new Bet[](bets.length);
    uint index = 0;

    for (uint32 i = 0; i < bets.length; i++) {
      Bet memory bet = bets[i];

      if (bet.bettor == msg.sender && bet.claimed == 0) {
        placedBets[index] = bets[i];
        index++;
      }
    }

    return placedBets;
  }

  function calculateBetPayoutAmount(Bet memory _bet) view public returns(uint) {
    uint payoutMultiplier = SafeMath.div((_bet.payoutOdds * scaleFactor), 10000);
    uint betProfit = uint(_bet.amount.mul(payoutMultiplier) / scaleFactor);

    return _bet.amount.add(betProfit);
  }

  function claimBetPayout(uint _betId) external {
    Bet storage bet = bets[_betId];
    Event memory bettingEvent = events[bet.eventId];

    require(msg.sender == bet.bettor, "Only original bettor address can claim payout");
    require(bettingEvent.result == bet.option, "Only winning bets can claim payout");
    require(bet.claimed == 0, "Bet payout was already claimed");

    uint payoutAmount = calculateBetPayoutAmount(bet);
    msg.sender.transfer(payoutAmount);

    bet.claimed = 1;
  }
}
