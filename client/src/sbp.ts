import { Contract } from '@ethersproject/contracts';
import web3 from './web3';

const address = '0x8A229d256d8A743DEAFF79ED0e3Ac00C2cE8CB90';

const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'bets',
    outputs: [
      {
        internalType: 'address payable',
        name: 'bettor',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'eventId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'option',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'events',
    outputs: [
      {
        internalType: 'string',
        name: 'option1',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'option2',
        type: 'string',
      },
      {
        internalType: 'uint64',
        name: 'startTime',
        type: 'uint64',
      },
      {
        internalType: 'uint8',
        name: 'result',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'payoutOdds',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_option1',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_option2',
        type: 'string',
      },
      {
        internalType: 'uint64',
        name: '_startTime',
        type: 'uint64',
      },
    ],
    name: 'addEvent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_eventId',
        type: 'uint256',
      },
    ],
    name: 'getEvent',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'option1',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'option2',
            type: 'string',
          },
          {
            internalType: 'uint64',
            name: 'startTime',
            type: 'uint64',
          },
          {
            internalType: 'uint8',
            name: 'result',
            type: 'uint8',
          },
        ],
        internalType: 'struct Sbp.Event',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'getEvents',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'option1',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'option2',
            type: 'string',
          },
          {
            internalType: 'uint64',
            name: 'startTime',
            type: 'uint64',
          },
          {
            internalType: 'uint8',
            name: 'result',
            type: 'uint8',
          },
        ],
        internalType: 'struct Sbp.Event[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'getEligibleBettingEvents',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'option1',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'option2',
            type: 'string',
          },
          {
            internalType: 'uint64',
            name: 'startTime',
            type: 'uint64',
          },
          {
            internalType: 'uint8',
            name: 'result',
            type: 'uint8',
          },
        ],
        internalType: 'struct Sbp.Event[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_eventId',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: '_result',
        type: 'uint8',
      },
    ],
    name: 'setEventResult',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_eventId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_option',
        type: 'uint256',
      },
    ],
    name: 'placeBet',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true,
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_betId',
        type: 'uint256',
      },
    ],
    name: 'getBet',
    outputs: [
      {
        components: [
          {
            internalType: 'address payable',
            name: 'bettor',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'eventId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'option',
            type: 'uint256',
          },
          {
            internalType: 'uint8[]',
            name: 'payoutOdds',
            type: 'uint8[]',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        internalType: 'struct Sbp.Bet',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'getBets',
    outputs: [
      {
        components: [
          {
            internalType: 'address payable',
            name: 'bettor',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'eventId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'option',
            type: 'uint256',
          },
          {
            internalType: 'uint8[]',
            name: 'payoutOdds',
            type: 'uint8[]',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        internalType: 'struct Sbp.Bet[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'getPlacedBets',
    outputs: [
      {
        components: [
          {
            internalType: 'address payable',
            name: 'bettor',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'eventId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'option',
            type: 'uint256',
          },
          {
            internalType: 'uint8[]',
            name: 'payoutOdds',
            type: 'uint8[]',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        internalType: 'struct Sbp.Bet[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_betId',
        type: 'uint256',
      },
    ],
    name: 'claimBetPayout',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const signer = web3.getSigner();

export default new Contract(address, abi, signer);
