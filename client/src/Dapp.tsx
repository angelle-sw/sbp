import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import getSbpContract from './sbp';
import { addBet, getBets, getEligibleEvents, verifyBet } from './redux/actions';
import { useCheckWallet, useContractOwner } from './hooks';
import { WrongNetwork } from './WrongNetwork';
import { Header } from './Header';
import { Dashboard } from './Dashboard';
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
  addBet: AddBet;
  bets: Bet[];
  eligibleEvents: EligibleEvent[];
  getBets: () => void;
  getEligibleEvents: () => void;
  verifyBet: (hash: string) => void;
};

const Dapp = ({ addBet, bets, eligibleEvents, getBets, getEligibleEvents, verifyBet }: Props) => {
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

        sbp.on(
          'NewBet',
          async (betId, sender, eventId, option, payoutOdds, amount, result, event) => {
            if (sender === account) {
              verifyBet(event.transactionHash);
            }
          }
        );
      })();
    }
  }, [account]);

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
      <Dashboard addBet={addBet} bets={bets} eligibleEvents={eligibleEvents} />
    </div>
  );
};

const mapStateToProps = (state: ReduxState) => ({
  bets: state.bets.data,
  eligibleEvents: state.eligibleEvents.data,
});

export default connect(mapStateToProps, {
  addBet,
  getBets,
  getEligibleEvents,
  verifyBet,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
})(Dapp);
