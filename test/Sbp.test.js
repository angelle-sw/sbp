const Sbp = artifacts.require('Sbp');

contract('Sbp', accounts => {
  it('should get smart contract balance', () => {
    Sbp.deployed()
      .then(instance => instance.balanceOf.call(accounts[0]))
      .then(balance =>
        assert.equal(
          balance.valueOf(),
          0
        )
      )
  });

  it('should add event', () => {
    Sbp.deployed()
      .then(instance => instance.addEvent.call("Charlotte", "OKC", 1608854400))
      .then(instance =>
        assert.equal(
          instance.events,
          {
            option1: "Charlotte",
            option2: "OKC",
            startTime: 1608854400,
            result: 0
          }
        )
      )
  });

  it('should get eligible betting events', () => {
    Sbp.deployed()
      .then(instance => instance.getEligibleBettingEvents.call())
      .then((events) =>
        assert.equal(
          events.length,
          1
        )
      )
  });
});
