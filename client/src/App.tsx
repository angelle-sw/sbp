import { useEffect, useState } from 'react';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { utils } from 'ethers';
import getSbpContract from './sbp';
import { Header } from './Header';
import { Dashboard } from './Dashboard';
import { DebugInfo } from './DebugInfo';
import './App.css';

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainnet
    3, // Ropsten
    4, // Rinkeby
    5777, // Ganache
  ],
});

const ConnectedApp = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [eligibleBettingEvents, setEligibleBettingEvents] = useState<EligibleBettingEvent[]>([]);
  const { account } = useWeb3React<Web3Provider>();

  useEffect(() => {
    if (account) {
      (async () => {
        const sbp = await getSbpContract();

        sbp.on('NewBet', async (betId, sender, eventId, option, payoutOdds, amount) => {
          if (sender === account) {
            const newBet = {
              amount: utils.formatEther(amount),
              eventId: Number(eventId),
              option: Number(option),
              payoutOdds,
            };

            setBets(prev => [...prev, newBet]);
          }
        });
      })();
    }
  }, [account]);

  useEffect(() => {
    (async () => {
      const sbp = await getSbpContract();

      sbp.on('NewEvent', (eventId, option1, option2, startTime, result) => {
        const newEvent = {
          option1,
          option2,
          result,
          startTime,
        };

        setEligibleBettingEvents(prev => [...prev, newEvent]);
      });
    })();
  }, []);

  return (
    <div className="App">
      <Header />
      <Dashboard
        bets={bets}
        eligibleBettingEvents={eligibleBettingEvents}
        setBets={setBets}
        setEligibleBettingEvents={setEligibleBettingEvents}
      />
      <AddEvent />
    </div>
  );
};

const AddEvent = () => {
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [startTime, setStartTime] = useState('');

  const addEvent = async (event: React.FormEvent) => {
    event.preventDefault();

    const sbp = await getSbpContract();

    await sbp.addEvent(option1, option2, 1614643200);
    setOption1('');
    setOption2('');
    setStartTime('');
  };

  return (
    <div>
      Add Event
      <form onSubmit={addEvent}>
        <div>
          <label>Option 1</label>
          <input onChange={event => setOption1(event.target.value)} value={option1} />
        </div>

        <div>
          <label>Option 2</label>
          <input onChange={event => setOption2(event.target.value)} value={option2} />
        </div>

        <div>
          <label>Start Time</label>
          <input onChange={event => setStartTime(event.target.value)} value={startTime} />
        </div>

        <button type="submit">Add Event</button>
      </form>
      <DebugInfo />
    </div>
  );
};

const App = () => {
  const { account, activate, active, chainId, error } = useWeb3React<Web3Provider>();
  const [loading, setLoading] = useState(true);
  const [connectError, setConnectError] = useState('');

  useEffect(() => {
    activate(injectedConnector);
  }, [account, activate, chainId]);

  useEffect(() => {
    if (active) {
      setLoading(true);
      setConnectError('');

      const { ETHEREUM_NETWORK } = process.env;
      if (ETHEREUM_NETWORK === 'local' && chainId !== 5777) {
        setConnectError('Unsupported Chain ID. Set your wallet network to your local network.');
      }

      if (ETHEREUM_NETWORK === 'testnet' && chainId !== 3) {
        setConnectError('Unsupported Chain ID. Set your wallet network to the Ropsten network.');
      }

      setLoading(false);
    }

    if (error) {
      setLoading(true);
      setConnectError('');

      const { ETHEREUM_NETWORK } = process.env;
      if (ETHEREUM_NETWORK === 'local' && chainId !== 5777) {
        setConnectError('Unsupported Chain ID. Set your wallet network to your local network.');
      }

      if (ETHEREUM_NETWORK === 'testnet' && chainId !== 3) {
        setConnectError('Unsupported Chain ID. Set your wallet network to the Ropsten network.');
      }

      setLoading(false);
    }
  }, [active, chainId, error?.message]);

  if (loading) {
    return <>Loading...</>;
  }

  if (connectError) {
    return <>Error {connectError}</>;
  }

  if (active) {
    return <ConnectedApp />;
  }

  return null;
};

const getLibrary = (provider: any): Web3Provider => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

export default () => {
  if (window.web3) {
    return (
      <Web3ReactProvider getLibrary={getLibrary}>
        <App />
      </Web3ReactProvider>
    );
  }

  return (
    <div>
      Download a Web3 Wallet like{' '}
      <a href="https://metamask.io" target="_blank">
        MetaMask
      </a>
    </div>
  );
};
