import { useEffect, useState } from 'react';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import sbp from './sbp';
import web3 from './web3';
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

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <AddEvent />
        <PlaceBet />
        <MyBets />
      </div>
    </Web3ReactProvider>
  );
}

const AddEvent = () => {
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [startTime, setStartTime] = useState('');

  const { account, activate, chainId } = useWeb3React<Web3Provider>();

  useEffect(() => {
    activate(injectedConnector);
  }, [account, activate, chainId]);

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

const PlaceBet = () => {
  const [event, setEvent] = useState('');
  const [option, setOption] = useState('');
  const [amount, setAmount] = useState('');

  const placeBet = async (formEvent: React.FormEvent) => {
    formEvent.preventDefault();

    const eventNum = Number(event);
    const optionNum = Number(option);

    await sbp.placeBet(eventNum, optionNum, {
      value: utils.parseEther(amount),
    });
  };

  return (
    <div>
      Place Bet
      <form onSubmit={placeBet}>
        <div>
          <label>Event</label>
          <input
            onChange={event => setEvent(event.target.value)}
            value={event}
          />
        </div>

        <div>
          <label>Option</label>
          <input
            onChange={event => setOption(event.target.value)}
            value={option}
          />
        </div>

        <div>
          <label>Amount</label>
          <input
            onChange={event => setAmount(event.target.value)}
            value={amount}
          />{' '}
          Ether
        </div>

        <button type="submit">Place Bet</button>
      </form>
    </div>
  );
};

type PlacedBetsResponse = {
  amount: BigNumber;
  bettor: string;
  eventId: BigNumber;
  option: BigNumber;
  payoutOdds: [number, number];
};

const MyBets = () => {
  const [bets, setBets] = useState([]);

  const getBets = async () => {
    const accounts = await web3.listAccounts();
    const response1 = await sbp;
    console.log(response1);
    const response = await sbp.getPlacedBets();
    const bets = response
      .filter(({ bettor }: PlacedBetsResponse) => bettor === accounts[0])
      .map(({ amount, eventId, option, payoutOdds }: PlacedBetsResponse) => ({
        amount: utils.formatEther(amount),
        eventId: Number(eventId),
        option: Number(option),
        payoutOdds,
      }));

    setBets(bets);
  };

  return (
    <div>
      {bets.map(({ amount, eventId, option, payoutOdds }) => (
        <div>
          <p>amount: {amount}</p>
          <p>eventId: {eventId}</p>
          <p>option: {option}</p>
          <p>
            payout odds: {payoutOdds[0]}:{payoutOdds[1]}
          </p>
        </div>
      ))}
      <button onClick={() => getBets()}>Get My Bets</button>
    </div>
  );
};

export default App;
