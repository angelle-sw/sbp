const fs = require('fs');
const path = require('path');
const Sbp = artifacts.require('../contracts/Sbp.sol');

const updateContractDataLocalData = address => {
  const contractDataLocalPath = path.join(
    __dirname,
    '../client/src/contract-data-local.json',
  );

  fs.writeFileSync(
    contractDataLocalPath,
    JSON.stringify(
      {
        address,
      },
      null,
      2,
    ),
  );
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
    updateContractDataLocalData(address);
  }
};

module.exports = deployer =>
  deployer.deploy(Sbp).then(() => {
    const json = Sbp.toJSON();
    updateContractData(json);
  });
