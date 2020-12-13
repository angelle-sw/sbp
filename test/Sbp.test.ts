const truffleAssert = require('truffle-assertions');
const { isEmptyEvent, isEmptyBet } = require('./helpers');

const Sbp = artifacts.require('Sbp');

let instance;

contract('Sbp', accounts => {
  beforeEach(async () => {
    instance = await Sbp.new();
  });

  it('should get smart contract balance', async () => {
    const balance = await instance.balanceOf.call();

    assert.equal(balance, 0);
  });

  it('should add events', async () => {
    const event1Receipt = await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    const event2Receipt = await instance.addEvent.sendTransaction('Boston', 'Milwaukee', 32534611200);

    const event1 = await instance.events.call(0);
    const event2 = await instance.events.call(1);

    assert.equal(event1.option1, 'Charlotte');
    assert.equal(event1.option2, 'OKC');
    assert.equal(event1.startTime, '32534524800');
    assert.equal(event1.result, '0');
    truffleAssert.eventEmitted(event1Receipt, 'NewEvent');

    assert.equal(event2.option1, 'Boston');
    assert.equal(event2.option2, 'Milwaukee');
    assert.equal(event2.startTime, '32534611200');
    assert.equal(event2.result, '0');
    truffleAssert.eventEmitted(event2Receipt, 'NewEvent');
  });

  it('should reject new event request from non-owner address', async () => {
    truffleAssert.fails(
      instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800, { from: accounts[1] })
    );
  });

  it('should get events', async () => {
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.addEvent.sendTransaction('Boston', 'Milwaukee', 32534611200);

    const events = await instance.getEvents.call();

    assert.equal(events.length, 2);

    assert.equal(events[0].option1, 'Charlotte');
    assert.equal(events[0].option2, 'OKC');
    assert.equal(events[0].startTime, '32534524800');
    assert.equal(events[0].result, '0');

    assert.equal(events[1].option1, 'Boston');
    assert.equal(events[1].option2, 'Milwaukee');
    assert.equal(events[1].startTime, '32534611200');
    assert.equal(events[1].result, '0');
  });

  it('should get event by id', async () => {
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.addEvent.sendTransaction('Boston', 'Milwaukee', 32534611200);

    const event1 = await instance.getEvent.call(0);
    const event2 = await instance.getEvent.call(1);

    assert.equal(event1.option1, 'Charlotte');
    assert.equal(event1.option2, 'OKC');
    assert.equal(event1.startTime, '32534524800');
    assert.equal(event1.result, '0');

    assert.equal(event2.option1, 'Boston');
    assert.equal(event2.option2, 'Milwaukee');
    assert.equal(event2.startTime, '32534611200');
    assert.equal(event2.result, '0');
  });

  it('should get eligible betting events', async () => {
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.addEvent.sendTransaction('Boston', 'Milwaukee', 666);
    await instance.addEvent.sendTransaction('Toronto', 'Memphis', 888);

    const events = (await instance.getEligibleBettingEvents.call()).filter(event => !isEmptyEvent(event));

    assert.equal(events.length, 1);
    assert.equal(events[0].option1, 'Charlotte');
    assert.equal(events[0].option2, 'OKC');
    assert.equal(events[0].startTime, '32534524800');
    assert.equal(events[0].result, '0');
  });

  it('should set event result', async () => {
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    const resultReceipt = await instance.setEventResult.sendTransaction(0, 1);
    const event = await instance.getEvent.call(0);

    assert.equal(event.result, 1);
    truffleAssert.eventEmitted(resultReceipt, 'NewEventResult');
  });

  it('should reject new event result request from non-owner address', async () => {
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    truffleAssert.fails(
      instance.setEventResult.sendTransaction(0, 1, { from: accounts[1] })
    );
  });

  it('should place bets', async () => {
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    const betReceipt = await instance.placeBet.sendTransaction(0, 1);
    const bet = await instance.bets.call(0);

    assert.equal(bet.eventId, 0);
    assert.equal(bet.option, 1);
    truffleAssert.eventEmitted(betReceipt, 'NewBet');
  });

  it('should reject bets placed after event has started', async () => {
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 666);

    truffleAssert.fails(
      instance.placeBet.sendTransaction(0, 1)
    );
  });

  it('should get bets', async () => {
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.addEvent.sendTransaction('Boston', 'Milwaukee', 32534611200);

    await instance.placeBet.sendTransaction(0, 1, { from: accounts[1], value: 300 });
    await instance.placeBet.sendTransaction(1, 2, { from: accounts[1], value: 666 });

    const bets = await instance.getBets.call();

    assert.equal(bets.length, 2);

    assert.equal(bets[0].bettor, accounts[1]);
    assert.equal(bets[0].eventId, 0);
    assert.equal(bets[0].option, 1);
    assert.equal(bets[0].amount, 300);
    assert.deepEqual(bets[0].payoutOdds, ['1', '1']);

    assert.equal(bets[1].bettor, accounts[1]);
    assert.equal(bets[1].eventId, 1);
    assert.equal(bets[1].option, 2);
    assert.equal(bets[1].amount, 666);
    assert.deepEqual(bets[1].payoutOdds, ['1', '1']);
  });

  it('should get bet by id', async () => {
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.addEvent.sendTransaction('Boston', 'Milwaukee', 32534611200);

    await instance.placeBet.sendTransaction(0, 1, { from: accounts[1], value: 300 });
    await instance.placeBet.sendTransaction(1, 2, { from: accounts[1], value: 666 });

    const bet1 = await instance.getBet.call(0);
    const bet2 = await instance.getBet.call(1);

    assert.equal(bet1.bettor, accounts[1]);
    assert.equal(bet1.eventId, 0);
    assert.equal(bet1.option, 1);
    assert.equal(bet1.amount, 300);
    assert.deepEqual(bet1.payoutOdds, ['1', '1']);

    assert.equal(bet2.bettor, accounts[1]);
    assert.equal(bet2.eventId, 1);
    assert.equal(bet2.option, 2);
    assert.equal(bet2.amount, 666);
    assert.deepEqual(bet2.payoutOdds, ['1', '1']);
  });


  it('should get unclaimed bets', async () => {
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.addEvent.sendTransaction('Boston', 'Milwaukee', 32534611200);

    await instance.placeBet.sendTransaction(0, 1, { from: accounts[1] });
    await instance.placeBet.sendTransaction(1, 2, { from: accounts[1] });
    await instance.placeBet.sendTransaction(1, 1, { from: accounts[2] });

    await instance.setEventResult.sendTransaction(0, 1);

    await instance.claimBetPayout.sendTransaction(0, { from: accounts[1] });

    const bets = (await instance.getUnclaimedBets.call({ from: accounts[1] })).filter(bet => !isEmptyBet(bet));

    assert.equal(bets.length, 1);
    assert.equal(bets[0].eventId, 1);
    assert.equal(bets[0].option, 2);
  });

  it('should calculate bet payout amount', async () => {
    const betAmount = 9999999999999999;

    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.placeBet.sendTransaction(0, 1, { from: accounts[1], value: betAmount });

    await instance.setEventResult.sendTransaction(0, 1);

    const bet = await instance.getBet.call(0, { from: accounts[1] });
    const betPayout = await instance.calculateBetPayoutAmount.call(bet, { from: accounts[1] });

    assert.equal(betPayout, betAmount * 2);
  });

  it('should accept bet payout claim', async () => {
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);

    await instance.placeBet.sendTransaction(0, 1, { from: accounts[1], value: 9999999999999999 });
    await instance.placeBet.sendTransaction(0, 2, { from: accounts[2], value: 9999999999999999 });

    await instance.setEventResult.sendTransaction(0, 1);

    const initialBalance = await web3.eth.getBalance(accounts[1]);

    await instance.claimBetPayout.sendTransaction(0, { from: accounts[1] });

    const currentBalance = await web3.eth.getBalance(accounts[1]);

    assert.isAbove(parseInt(currentBalance, 10), parseInt(initialBalance, 10));
    });

  it('should reject bet payout claim if bet was lost', async () => {
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);

    await instance.placeBet.sendTransaction(0, 1, { from: accounts[1], value: 9999999999999999 });
    await instance.placeBet.sendTransaction(0, 2, { from: accounts[2], value: 9999999999999999 });

    await instance.setEventResult.sendTransaction(0, 2);

    truffleAssert.fails(
      instance.claimBetPayout.sendTransaction(0, { from: accounts[1] })
    );
  });

  it('should reject bet payout claim if payout was already claimed', async () => {
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);

    await instance.placeBet.sendTransaction(0, 1, { from: accounts[1], value: 9999999999999999 });
    await instance.placeBet.sendTransaction(0, 2, { from: accounts[2], value: 9999999999999999 });

    await instance.setEventResult.sendTransaction(0, 1);
    await instance.claimBetPayout.sendTransaction(0, { from: accounts[1] })

    truffleAssert.fails(
      instance.claimBetPayout.sendTransaction(0, { from: accounts[1] })
    );
  });

  it('should reject bet payout claim if requested by foreign address', async () => {
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);

    await instance.placeBet.sendTransaction(0, 1, { from: accounts[1], value: 9999999999999999 });
    await instance.placeBet.sendTransaction(0, 2, { from: accounts[2], value: 9999999999999999 });

    await instance.setEventResult.sendTransaction(0, 1);

    truffleAssert.fails(
      instance.claimBetPayout.sendTransaction(0, { from: accounts[2] })
    );
  });
});
