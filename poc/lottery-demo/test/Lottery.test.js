const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { bytecode, interface } = require('../compile');

const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('should enter lottery', async () => {
    await lottery.methods.play().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether'),
    });

    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });

    assert.strictEqual(accounts[0], players[0]);
    assert.strictEqual(1, players.length);
  });

  it('should enter lottery multiple times', async () => {
    await lottery.methods.play().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether'),
    });

    await lottery.methods.play().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether'),
    });

    await lottery.methods.play().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether'),
    });

    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });

    assert.strictEqual(accounts[0], players[0]);
    assert.strictEqual(accounts[1], players[1]);
    assert.strictEqual(accounts[2], players[2]);

    assert.strictEqual(3, players.length);
  });

  it('should require a minimum amount of ether to play', async () => {
    try {
      await lottery.methods.play().send({
        from: accounts[0],
        value: web3.utils.toWei('0.001', 'ether'),
      });
    } catch (error) {
      assert(error);
      return;
    }
    assert(false);
  });

  it('should only let manager pick winner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      });
    } catch (error) {
      assert(error);
      return;
    }
    assert(false);
  });

  it('should conduct lottery', async () => {
    await lottery.methods.play().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether'),
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);

    const contractBalanceBefore = await web3.eth.getBalance(
      lottery.options.address,
    );

    assert.strictEqual(contractBalanceBefore, web3.utils.toWei('2', 'ether'));

    await lottery.methods.pickWinner().send({ from: accounts[0] });

    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const difference = finalBalance - initialBalance;
    const expected = Number(web3.utils.toWei('1.999953113999999', 'ether'));

    const contractBalanceAfter = await web3.eth.getBalance(
      lottery.options.address,
    );

    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });

    assert.deepStrictEqual(players, []);
    assert.strictEqual(contractBalanceAfter, '0');
    assert.strictEqual(difference, expected);
  });
});
