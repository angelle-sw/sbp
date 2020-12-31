import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import getSbpContract from './sbp';
import {
  addBet,
  addEvent,
  getBets,
  getEligibleEvents,
  verifyBet,
  verifyEvent,
} from './redux/actions';
import { useCheckWallet, useContractOwner } from './hooks';
import { WrongNetwork } from './WrongNetwork';
import { Header } from './Header';
import { Dashboard } from './Dashboard';
import { AddEvent } from './AddEvent';
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
  addBet: typeof addBet;
  addEvent: typeof addEvent;
  bets: Bets;
  eligibleEvents: EligibleEvents;
  eligibleEventsCount: number;
  getBets: typeof getBets;
  getEligibleEvents: typeof getEligibleEvents;
  verifyBet: typeof verifyBet;
  verifyEvent: typeof verifyEvent;
};

const Dapp = ({
  addBet,
  addEvent,
  bets,
  eligibleEvents,
  eligibleEventsCount,
  getBets,
  getEligibleEvents,
  verifyBet,
  verifyEvent,
}: Props) => {
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

  useEffect(() => {
    if (account) {
      (async () => {
        const sbp = await getSbpContract();

        sbp.on('NewBet', (betId, sender, eventId, option, payoutOdds, amount, result, event) => {
          if (sender === account) {
            verifyBet(event.transactionHash);
          }
        });
      })();
    }
  }, [account]);

  useEffect(() => {
    (async () => {
      const sbp = await getSbpContract();

      sbp.on('NewEvent', (eventId, option1, option2, startTime, payoutOdds, result, event) => {
        verifyEvent(event.transactionHash);
      });
    })();
  }, []);

  if (loading) {
    return <>Loading...</>;
  }

  if (connectErrorMessage) {
    return <WrongNetwork error={connectErrorMessage} />;
  }

  return (
    <Routes>
      <Route path="/">
        <div className="App">
          <Header account={account} owner={owner} />
          <Dashboard addBet={addBet} bets={bets} eligibleEvents={eligibleEvents} />
        </div>
      </Route>
      <Route path="/add-event">
        <AddEvent addEvent={addEvent} eligibleEventsCount={eligibleEventsCount} />
      </Route>
    </Routes>
  );
};

const mapStateToProps = (state: ReduxState) => ({
  bets: state.bets.data,
  eligibleEvents: state.eligibleEvents.data,
  eligibleEventsCount: state.eligibleEvents.data.length,
});

export default connect(mapStateToProps, {
  addBet,
  addEvent,
  getBets,
  getEligibleEvents,
  verifyBet,
  verifyEvent,
})(Dapp);
