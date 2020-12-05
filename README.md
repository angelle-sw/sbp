# sbp

Sports/event betting platform powered by Ethereum smart contracts with automated market making.

## Goals

Provide a fully transparent, highly liquid, decentralized betting platform with low transaction costs and instant payouts.

## Technologies

+ Ethereum smart contracts
+ Chainlink oracles

## MVP1

+ Build scraper to aggregate latest NBA scores
+ Expose NBA score data through Chainlink oracle
+ Build Ethereum smart contract with the following features:
  + Accept tokenized bets from addresses on outcome of games
  + Request data from score API every 30 seconds
  + Settle bets of completed games by paying out winning addresses using static 1:1 payout odds
+ Deploy contract to Ethereum Testnet
+ Build web app front end with the following features:
  + Connect to Metamask wallet
  + Display all scheduled NBA games eligible for betting
  + Accept bets on outcome of games
  + Display current bets for connected wallet addresses
  + Display historical bet results for connected wallet addresses
  
## MVP2

+ Add automated market making
+ Use third-party Chainlink oracles to source score data
