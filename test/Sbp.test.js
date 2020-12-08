const Sbp = artifacts.require('Sbp');

contract('Sbp', accounts => {
  it('should return smart contract balance', () => {
    Sbp.deployed()
      .then(instance => instance.balanceOf.call(accounts[0]))
      .then(balance => {
        assert.equal(
          balance.valueOf(),
          0,
          "contract balance is incorrect"
        )
      });
  });

  it('should add event', () => {
    Sbp.deployed()
      .then(instance => instance.addEvent.call("Charlotte", "OKC", 1608854400))
      .then(() => {
        assert.equal(
          instance.events,
          {
            option1: "Charlotte",
            option2: "OKC",
            startTime: 1608854400,
            result: 0
          }
        )
      });
  });
});
