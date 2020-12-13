import { useEffect, useState } from 'react';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { utils } from 'ethers';
import sbp from './sbp';
import web3 from './web3';
import { Header } from './Header';
import { Dashboard } from './Dashboard';
import './App.css';

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
    1337, // Ganache
  ],
});

const App = () => {
  const [bets, setBets] = useState<Bets[]>([]);
  const { account, activate, chainId } = useWeb3React<Web3Provider>();

  useEffect(() => {
    sbp.on(
      'NewBet',
      async (betId, sender, eventId, option, payoutOdds, amount) => {
        const accounts = await web3.listAccounts();

        if (sender === accounts[0]) {
          const newBet = {
            amount: utils.formatEther(amount),
            eventId: Number(eventId),
            option: Number(option),
            payoutOdds,
          };
          setBets(prev => [...prev, newBet]);
        }
      },
    );
  }, []);

  useEffect(() => {
    activate(injectedConnector);
  }, [account, activate, chainId]);

  return (
    <div className="App">
      <Header />
      <Dashboard bets={bets} setBets={setBets} />
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

    await sbp.addEvent(option1, option2, 1614643200);
  };

  return (
    <div>
      Add Event
      <form onSubmit={addEvent}>
        <div>
          <label>Option 1</label>
          <input
            onChange={event => setOption1(event.target.value)}
            value={option1}
          />
        </div>

        <div>
          <label>Option 2</label>
          <input
            onChange={event => setOption2(event.target.value)}
            value={option2}
          />
        </div>

        <div>
          <label>Start Time</label>
          <input
            onChange={event => setStartTime(event.target.value)}
            value={startTime}
          />
        </div>

        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

const getLibrary = (provider: any): Web3Provider => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

export const Web3ConnectedApp = () => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <App />
  </Web3ReactProvider>
);
