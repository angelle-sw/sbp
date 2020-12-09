const Sbp = artifacts.require('Sbp');

contract('Sbp', async accounts => {
  it('should get smart contract balance', async () => {
    Sbp.deployed()
      .then(instance => instance.balanceOf.call(accounts[0]))
      .then(balance =>
        assert.equal(
          balance.valueOf(),
          0
        )
      )
  });

  it('should add event', async () => {
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

  it('should get eligible betting events', async () => {
    Sbp.deployed()
      .then(instance => instance.addEvent.call("Charlotte", "OKC", 1608854400))
      .then(instance => instance.getEligibleBettingEvents().call())
      .then((events) =>
        assert.equal(
          events.length,
          1
        )
      )
  });

  it('should place bet', async () => {
    Sbp.deployed()
      .then(instance => instance.placeBet.send(0, 1, { amount: 0.01, from: 0x8d6CF62a434CbE0FD985d6fA2Dd22F010490a791 }))
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
});
