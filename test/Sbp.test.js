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
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.addEvent.sendTransaction('Boston', 'Milwaukee', 32534611200);

    const event1 = await instance.events.call(0);
    const event2 = await instance.events.call(1);

    assert.equal(event1.option1, 'Charlotte');
    assert.equal(event1.option2, 'OKC');
    assert.equal(event1.startTime, '32534524800');
    assert.equal(event1.result, '0');

    assert.equal(event2.option1, 'Boston');
    assert.equal(event2.option2, 'Milwaukee');
    assert.equal(event2.startTime, '32534611200');
    assert.equal(event2.result, '0');
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

    const events = (await instance.getEligibleBettingEvents.call()).filter(event => event.startTime !== '0');

    assert.equal(events.length, 1);
    assert.equal(events[0].option1, 'Charlotte');
    assert.equal(events[0].option2, 'OKC');
    assert.equal(events[0].startTime, '32534524800');
    assert.equal(events[0].result, '0');
  });


  it('should set event result', async () => {
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.setEventResult.sendTransaction(0, 1);
    const event = await instance.getEvent.call(0);

    assert.equal(event.result, 1);
  });

  it('should place bets', async () => {
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.placeBet.sendTransaction(0, 1);
    const bet = await instance.bets.call(0);

    assert.equal(bet.eventId, 0);
    assert.equal(bet.option, 1);
  });

  it('should get placed bets', async () => {
    await instance.addEvent.sendTransaction('Charlotte', 'OKC', 32534524800);
    await instance.addEvent.sendTransaction('Boston', 'Milwaukee', 32534611200);

    await instance.placeBet.sendTransaction(0, 1);
    await instance.placeBet.sendTransaction(1, 2);

    const bets = await instance.getPlacedBets.call();

    assert.equal(bets.length, 2);

    assert.equal(bets[0].eventId, 0);
    assert.equal(bets[0].option, 1);

    assert.equal(bets[1].eventId, 1);
    assert.equal(bets[1].option, 2);
  });
});
