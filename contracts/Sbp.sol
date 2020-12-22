// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Sbp is Ownable {
  using SafeMath for uint;

  Event[] public events;
  Bet[] public bets;

  // Hardcode 1:1 static payout odds for now
  uint8[] public payoutOdds = [1, 1];

  struct Event {
    string option1;
    string option2;
    uint64 startTime;
    uint8 result;
  }

  struct Bet {
    address payable bettor;
    uint eventId;
    uint option;
    uint8[] payoutOdds;
    uint amount;
    uint8 claimed;
  }

  event NewEvent(uint id, string option1, string option2, uint64 startTime, uint8 result);
  event NewBet(uint id, address bettor, uint eventId, uint option, uint8[] payoutOdds, uint amount, uint8 claimed);
  event NewEventResult(uint id, uint8 result);

  function balanceOf() external view returns(uint) {
    return address(this).balance;
  }

  function addEvent(string memory _option1, string memory _option2, uint64 _startTime) external onlyOwner {
    uint eventId = events.length;

    Event memory newEvent = Event(_option1, _option2, _startTime, 0);
    events.push(newEvent);

    emit NewEvent(eventId, _option1, _option2, _startTime, 0);
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

  function placeBet(uint _eventId, uint _option) external payable {
    require(events[_eventId].startTime > block.timestamp, "Bets cannot be placed after event has started");

    uint betId = bets.length;

    Bet memory bet = Bet(msg.sender, _eventId, _option, payoutOdds, msg.value, 0);
    bets.push(bet);

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

  function calculateBetPayoutAmount(Bet memory _bet) pure public returns(uint) {
    // Since Solidity does not support fixed point numbers, a scale factor is used to scale up the
    // payout odd factors when calculating the payout amount
    uint scaleFactor = 1000000;

    uint payoutMultiplier = SafeMath.div((_bet.payoutOdds[0] * scaleFactor), _bet.payoutOdds[1]);
    uint betProfit = uint(_bet.amount.mul(payoutMultiplier) / scaleFactor);

    return _bet.amount.add(betProfit);
  }

  function claimBetPayout(uint _betId) external {
    Bet storage bet = bets[_betId];
    Event memory betEvent = events[bet.eventId];

    require(msg.sender == bet.bettor, "Only original bettor address can claim payout");
    require(betEvent.result == bet.option, "Only winning bets can claim payout");
    require(bet.claimed == 0, "Bet payout was already claimed");

    uint payoutAmount = calculateBetPayoutAmount(bet);
    msg.sender.transfer(payoutAmount);

    bet.claimed = 1;
  }
}
