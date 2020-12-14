// TODO: Some structs return `string` for `uint` properties but typechain incorrectly
// generates a `BN` type definition
// e.g. `event.startTime` property from `getEvents`

const truffleAssert = require('truffle-assertions');
const { isEmptyEvent, isEmptyBet } = require('./helpers');

const Sbp = artifacts.require('Sbp');

const STATIC_BET_AMOUNT = web3.utils.toWei('0.002');

contract('Sbp', accounts => {
  it('should get smart contract balance', async () => {
    const instance = await Sbp.new();
    const balance = await instance.balanceOf();

    assert.equal(balance.toString(), '0');
  });

  it('should add events', async () => {
    const instance = await Sbp.new();

    const event1Receipt = await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    const event2Receipt = await instance.addEvent.sendTransaction('Boston', 'Milwaukee', 32534611200);

    const event1 = await instance.events(0);
    const event2 = await instance.events(1);

    assert.equal(event1[0], 'Charlotte');
    assert.equal(event1[1], 'OKC');
    assert.equal(event1[2].toString(), '32534524800');
    assert.equal(event1[3].toString(), '0');
    truffleAssert.eventEmitted(event1Receipt, 'NewEvent');

    assert.equal(event2[0], 'Boston');
    assert.equal(event2[1], 'Milwaukee');
    assert.equal(event2[2].toString(), '32534611200');
    assert.equal(event2[3].toString(), '0');
    truffleAssert.eventEmitted(event2Receipt, 'NewEvent');
  });

  it('should reject new event request from non-owner address', async () => {
    const instance = await Sbp.new();

    truffleAssert.fails(
      instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800, { from: accounts[1] })
    );
  });

  it('should get events', async () => {
    const instance = await Sbp.new();

    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.addEvent.sendTransaction('Boston', 'Milwaukee', 32534611200);

    const events = await instance.getEvents();

    assert.equal(events.length, 2);

    assert.equal(events[0].option1, 'Charlotte');
    assert.equal(events[0].option2, 'OKC');
    assert.equal(events[0].startTime.toString(), '32534524800');
    assert.equal(events[0].result.toString(), '0');

    assert.equal(events[1].option1, 'Boston');
    assert.equal(events[1].option2, 'Milwaukee');
    assert.equal(events[1].startTime.toString(), '32534611200');
    assert.equal(events[1].result.toString(), '0');
  });

  it('should get event by id', async () => {
    const instance = await Sbp.new();

    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.addEvent.sendTransaction('Boston', 'Milwaukee', 32534611200);

    const event1 = await instance.getEvent(0);
    const event2 = await instance.getEvent(1);

    assert.equal(event1.option1, 'Charlotte');
    assert.equal(event1.option2, 'OKC');
    assert.equal(event1.startTime.toString(), '32534524800');
    assert.equal(event1.result.toString(), '0');

    assert.equal(event2.option1, 'Boston');
    assert.equal(event2.option2, 'Milwaukee');
    assert.equal(event2.startTime.toString(), '32534611200');
    assert.equal(event2.result.toString(), '0');
  });

  it('should get eligible betting events', async () => {
    const instance = await Sbp.new();

    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.addEvent.sendTransaction('Boston', 'Milwaukee', 666);
    await instance.addEvent.sendTransaction('Toronto', 'Memphis', 888);

    const events = (await instance.getEligibleBettingEvents()).filter(event => !isEmptyEvent(event));

    assert.equal(events.length, 1);
    assert.equal(events[0].option1, 'Charlotte');
    assert.equal(events[0].option2, 'OKC');
    assert.equal(events[0].startTime.toString(), '32534524800');
    assert.equal(events[0].result.toString(), '0');
  });

  it('should set event result', async () => {
    const instance = await Sbp.new();

    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    const resultReceipt = await instance.setEventResult.sendTransaction(0, 1);
    const event = await instance.getEvent(0);

    assert.equal(event.result.toString(), '1');
    truffleAssert.eventEmitted(resultReceipt, 'NewEventResult');
  });

  it('should reject new event result request from non-owner address', async () => {
    const instance = await Sbp.new();

    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    truffleAssert.fails(
      instance.setEventResult.sendTransaction(0, 1, { from: accounts[1] })
    );
  });

  it('should place bets', async () => {
    const instance = await Sbp.new();

    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    const betReceipt = await instance.placeBet.sendTransaction(0, 1, { from: accounts[1], value: STATIC_BET_AMOUNT });
    const bet = await instance.bets(0);

    // TODO: check `payoutOdds`, `amount`, and `claimed` property values
    assert.equal(bet[0], accounts[1]);
    assert.equal(bet[1].toString(), '0');
    assert.equal(bet[2].toString(), '1');

    truffleAssert.eventEmitted(betReceipt, 'NewBet');
  });

  it('should reject bets placed after event has started', async () => {
    const instance = await Sbp.new();

    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 666);

    truffleAssert.fails(
      instance.placeBet.sendTransaction(0, 1)
    );
  });

  it('should get bets', async () => {
    const instance = await Sbp.new();

    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.addEvent.sendTransaction('Boston', 'Milwaukee', 32534611200);

    await instance.placeBet.sendTransaction(0, 1, { from: accounts[1], value: '300' });
    await instance.placeBet.sendTransaction(1, 2, { from: accounts[1], value: '666' });

    const bets = await instance.getBets();

    assert.equal(bets.length, 2);

    assert.equal(bets[0].bettor, accounts[1]);
    assert.equal(bets[0].eventId.toString(), '0');
    assert.equal(bets[0].option.toString(), '1');
    assert.equal(bets[0].amount.toString(), '300');
    assert.equal(bets[0].payoutOdds.toString(), ['1', '1'].toString());

    assert.equal(bets[1].bettor, accounts[1]);
    assert.equal(bets[1].eventId.toString(), '1');
    assert.equal(bets[1].option.toString(), '2');
    assert.equal(bets[1].amount.toString(), '666');
    assert.equal(bets[1].payoutOdds.toString(), ['1', '1'].toString());
  });

  it('should get bet by id', async () => {
    const instance = await Sbp.new();

    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.addEvent.sendTransaction('Boston', 'Milwaukee', 32534611200);

    await instance.placeBet.sendTransaction(0, 1, { from: accounts[1], value: '300' });
    await instance.placeBet.sendTransaction(1, 2, { from: accounts[1], value: '666' });

    const bet1 = await instance.getBet(0);
    const bet2 = await instance.getBet(1);

    assert.equal(bet1.bettor, accounts[1]);
    assert.equal(bet1.eventId.toString(), '0');
    assert.equal(bet1.option.toString(), '1');
    assert.equal(bet1.amount.toString(), '300');
    assert.equal(bet1.payoutOdds.toString(), ['1', '1'].toString());

    assert.equal(bet2.bettor, accounts[1]);
    assert.equal(bet2.eventId.toString(), '1');
    assert.equal(bet2.option.toString(), '2');
    assert.equal(bet2.amount.toString(), '666');
    assert.equal(bet2.payoutOdds.toString(), ['1', '1'].toString());
  });


  it('should get unclaimed bets', async () => {
    const instance = await Sbp.new();

    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.addEvent.sendTransaction('Boston', 'Milwaukee', 32534611200);

    await instance.placeBet.sendTransaction(0, 1, { from: accounts[1] });
    await instance.placeBet.sendTransaction(1, 2, { from: accounts[1] });
    await instance.placeBet.sendTransaction(1, 1, { from: accounts[2] });

    await instance.setEventResult.sendTransaction(0, 1);

    await instance.claimBetPayout.sendTransaction(0, { from: accounts[1] });

    const bets = (await instance.getUnclaimedBets({ from: accounts[1] })).filter(bet => !isEmptyBet(bet));

    assert.equal(bets.length, 1);
    assert.equal(bets[0].eventId.toString(), '1');
    assert.equal(bets[0].option.toString(), '2');
  });

  it('should calculate bet payout amount', async () => {
    const instance = await Sbp.new();

    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.placeBet.sendTransaction(0, 1, { from: accounts[1], value: STATIC_BET_AMOUNT });

    await instance.setEventResult.sendTransaction(0, 1);

    const bet = await instance.getBet(0, { from: accounts[1] });
    const betPayout = await instance.calculateBetPayoutAmount(bet, { from: accounts[1] });

    assert.equal(betPayout.toString(), (parseInt(STATIC_BET_AMOUNT, 10) * 2).toString());
  });

  it('should accept bet payout claim', async () => {
    const instance = await Sbp.new();

    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);

    await instance.placeBet.sendTransaction(0, 1, { from: accounts[1], value: STATIC_BET_AMOUNT });
    await instance.placeBet.sendTransaction(0, 2, { from: accounts[2], value: STATIC_BET_AMOUNT });

    await instance.setEventResult.sendTransaction(0, 1);

    const initialBalance = await web3.eth.getBalance(accounts[1]);

    await instance.claimBetPayout.sendTransaction(0, { from: accounts[1] });

    const currentBalance = await web3.eth.getBalance(accounts[1]);

    assert.isAbove(parseInt(currentBalance, 10), parseInt(initialBalance, 10));
    });

  it('should reject bet payout claim if bet was lost', async () => {
    const instance = await Sbp.new();

    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);

    await instance.placeBet.sendTransaction(0, 1, { from: accounts[1], value: STATIC_BET_AMOUNT });
    await instance.placeBet.sendTransaction(0, 2, { from: accounts[2], value: STATIC_BET_AMOUNT });

    await instance.setEventResult.sendTransaction(0, 2);

    truffleAssert.fails(
      instance.claimBetPayout.sendTransaction(0, { from: accounts[1] })
    );
  });

  it('should reject bet payout claim if payout was already claimed', async () => {
    const instance = await Sbp.new();

    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);

    await instance.placeBet.sendTransaction(0, 1, { from: accounts[1], value: STATIC_BET_AMOUNT });
    await instance.placeBet.sendTransaction(0, 2, { from: accounts[2], value: STATIC_BET_AMOUNT });

    await instance.setEventResult.sendTransaction(0, 1);
    await instance.claimBetPayout.sendTransaction(0, { from: accounts[1] })

    truffleAssert.fails(
      instance.claimBetPayout.sendTransaction(0, { from: accounts[1] })
    );
  });

  it('should reject bet payout claim if requested by foreign address', async () => {
    const instance = await Sbp.new();

    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);

    await instance.placeBet.sendTransaction(0, 1, { from: accounts[1], value: STATIC_BET_AMOUNT });
    await instance.placeBet.sendTransaction(0, 2, { from: accounts[2], value: STATIC_BET_AMOUNT });

    await instance.setEventResult.sendTransaction(0, 1);

    truffleAssert.fails(
      instance.claimBetPayout.sendTransaction(0, { from: accounts[2] })
    );
  });
});
