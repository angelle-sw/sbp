const fs = require('fs');
const path = require('path');
const Sbp = artifacts.require('../contracts/Sbp.sol');

const updateEnvFile = address => {
  const envs = fs.readFileSync(path.join(__dirname, '../client/.env'), 'utf8');

  const array = envs.split('\n');

  const envObj = array.reduce((acc, cur) => {
    const [key, value] = cur.split('=');
    acc[key] = value;
    return acc;
  }, {});

  envObj.REACT_APP_CONTRACT_ADDRESS = address;

  const newEnvs = Object.entries(envObj).map(env => {
    const [key, value] = env;
    return `${key}=${value}`;
  });

  const joined = newEnvs.join('\n');

  fs.writeFileSync(path.join(__dirname, '../client/.env'), joined);
};

const updateContractData = ({ abi, networks }) => {
  fs.writeFileSync(
    path.join(__dirname, '../client/src/contract-data.json'),
    JSON.stringify(
      {
        abi,
        address: (networks[3] && networks[3].address) || '',
      },
      null,
      2,
    ),
  );

  // only update the env file if a local contract address exist
  if (networks[5777] && networks[5777].address) {
    const address = networks[5777].address;
    updateEnvFile(address);
  }
};

module.exports = deployer =>
  deployer.deploy(Sbp).then(() => {
    const json = Sbp.toJSON();
    updateContractData(json);
  });
