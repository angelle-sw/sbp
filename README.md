# sbp

Decentralized sports & event betting platform powered by Ethereum smart contracts and automated market making.

## Core Concepts

### Event creation

New betting events will initially be created by the founding team by calling a `createEvent` method on the smart contract. In the future, this event data could be requested from a Chainlink oracle.

### Betting

Any Ethereum wallet can place bets on an event by calling the `placeBet` method on the smart contract and sending a bet option and wager amount in the form of ETH tokens.

This process will be facilitated by a web app which displays all events eligible for betting and allowing users to claim payouts for won bets.

Users will transfer funds and interact with the smart contract by connecting a Metamask wallet.

### Outcome reporting

Outcome reporting data will be sourced from Chainlink oracles.

### Staking

In order to create a highly liquid market, the platform will incentivize users to stake funds into a liquidity pool, which will be used to payout winning bets. Having a highly liquid pool ensures that, no matter which side wins a bet, there is enough ETH in the pool to pay out all the winners, even if the platform loses money overall.

To incentivize stakers, the platform can offer a percentage cut of the platform fee to the liquidity pool, where each liquidity provider earns a staking reward in proportion to the amount of ETH they are staking relative to the overall pool.

With this model, early stakers will potentially make up a large percentage of the liquidity pool and therefore earn high rewards, but as more stakers add liquidity, it will lower the early stakers' earnings, as they now make up a smaller percentage of the liquidity pool.

This creates a self-correcting system -- in scenarios where there is a low amount of liquidity, people will be more incentivized to stake because rewards will be higher; in contrast, in scenarios where there is excess liquidity, rewards will be lower, incentivizing stakers to exit the liquidity pool and deploy their capital into something more productive.

### Odds making

One of the main project challenges is defining the initial payout odds for an event, which in traditional sports betting is usually done by a combination of proprietary computer algorithms and "experts".

These initial odds could potentially be informed using Chainlink oracles to get the initial sports betting odds defined by Vegas and global sportsbooks.

Another approach is to allow anyone on the platform to create a new betting market for an event (for which the odds will be auto-adjusted as bets come in from both sides), and staking an amount of ETH into the pool to sufficiently cover payouts for either result.

With this model, odds makers will be incentivized to set the initial odds to align as closely as possible with the real world expected outcome in order to maximize their profit by having a balanced book; this is reflective of how most traditional sportsbooks make money.

### Passive earning

The platform can move betting pool funds into a decentralized lending platform like [Aave](https://aave.com) or [Compound](https://compound.finance) and earn interest from borrowers. This passive interest earning can be passed off to users of the platform in the form of better odds payouts and/or a betting rewards system.

### Betting rewards system

The platform can incentivize users to place bets by rewarding every placed bet with a number of reward points proportional to the size of the bet. Points could later be redeemed for ETH by calling the `redeemPointsForEth` method on the smart contract. These points could be tracked directly on the blockchain in a mapping of `address => pointsEarned`. Alternatively, the rewards points could be tokenized, allowing users to trade rewards tokens freely across wallets.

### Governance

The platform will initially be bootstrapped and governed in large part by the founding team. As the community grows and the platform matures, governance
will be incrementally transferred over to the community in the form of a decentralized autonomous organization (DAO).

Holders of a platform-minted ERC20 governance token may cast votes to adopt and reject new proposals to the platform protocol.

### Governance token distribution

The governance token could be distributed as a reward to odds makers for maintaining platform events, proportional to the number of events they maintain relative to the total number of events on the platform.

## Plan

The development and launch of the platform will be split into several phases as detailed below:

### Phase 0

+ Define platform protocol

### Phase 1
+ Build scraper to aggregate latest NBA scores
+ Expose NBA score data via Chainlink oracle
+ Build Ethereum smart contract with the following features:
  - Accept tokenized bets from addresses on outcome of games
  - Allow bettors to claim payouts for bets won
  - Payout winning bettors using static 1:1 payout odds
+ Deploy contract to Ethereum Testnet
+ Build web app front end with the following features:
  - Connect to Metamask wallet
  - Display all scheduled NBA games eligible for betting
  - Accept bets on outcome of games
  - Display current bets for connected wallet addresses
  - Display historical bet results for connected wallet addresses

### Phase 2

+ Implement automated market making
+ Use third-party Chainlink oracles to source score data
+ Add automated testing to validate smart contract edge scenarios
+ Solidify fees and business model

### Phase 3

+ Deploy contract to Ethereum mainnet

### Contributing

Install and run [Ganache](https://www.trufflesuite.com/ganache).

Clone the repository:

```sh
$ git clone https://github.com/angelle-sw/sbp
```

Install dependencies:

```sh
$ yarn
```

Compile contracts:

```sh
$ yarn compile
```

Run migrations:

```sh
$ yarn migrate
```

Run tests (implicitly compiles contracts and runs migrations before running):

```sh
$ yarn test
```
