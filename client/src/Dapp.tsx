import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { utils } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { getBets, getEligibleEvents } from './redux/actions';
import getSbpContract from './sbp';
import { useCheckWallet, useContractOwner } from './hooks';
import { WrongNetwork } from './WrongNetwork';
import { Header } from './Header';
import { Dashboard } from './Dashboard';
import { transformBets, transformEvents } from './selectors';
import './Dapp.css';

const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainnet
    3, // Ropsten
    4, // Rinkeby
    5777, // Ganache
  ],
});

type Props = {
  bets: Bet[];
  eligibleEvents: EligibleEvent[];
  getBets: () => void;
  getEligibleEvents: () => void;
};

const Dapp = ({ bets, eligibleEvents, getBets, getEligibleEvents }: Props) => {
  const owner = useContractOwner();
  const { account, activate, active, chainId, error } = useWeb3React();
  const { connectErrorMessage, loading } = useCheckWallet(active, chainId, error);

  useEffect(() => {
    getBets();
  }, []);

  useEffect(() => {
    getEligibleEvents();
  }, []);

  // attempt to connect to wallet
  useEffect(() => {
    activate(injectedConnector);
  }, [account, activate, chainId]);

  // useEffect(() => {
  //   if (account) {
  //     (async () => {
  //       const sbp = await getSbpContract();

  //       sbp.on('NewBet', async (betId, sender, eventId, option, payoutOdds, amount) => {
  //         if (sender === account) {
  //           const newBet = {
  //             amount: utils.formatEther(amount),
  //             eventId: Number(eventId),
  //             option: Number(option),
  //             payoutOdds,
  //           };

  //           setBets(prev => [...prev, newBet]);
  //         }
  //       });
  //     })();
  //   }
  // }, [account]);

  // useEffect(() => {
  //   (async () => {
  //     const sbp = await getSbpContract();

  //     sbp.on('NewEvent', (eventId, option1, option2, startTime, result) => {
  //       const newEvent = {
  //         option1,
  //         option2,
  //         result,
  //         startTime,
  //       };

  //       setEligibleBettingEvents(prev => [...prev, newEvent]);
  //     });
  //   })();
  // }, []);

  if (loading) {
    return <>Loading...</>;
  }

  if (connectErrorMessage) {
    return <WrongNetwork error={connectErrorMessage} />;
  }

  return (
    <div className="App">
      <Header account={account} owner={owner} />
      <Dashboard bets={bets} eligibleEvents={eligibleEvents} />
    </div>
  );
};

const mapStateToProps = (state: ReduxState) => {
  return {
    bets: transformBets(state),
    eligibleEvents: transformEvents(state),
  };
};

export default connect(mapStateToProps, { getBets, getEligibleEvents })(Dapp);
