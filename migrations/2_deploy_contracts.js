const fs = require('fs');
const path = require('path');
const Sbp = artifacts.require('../contracts/Sbp.sol');

const writeContractData = (data, dataPath) => {
  fs.writeFileSync(
    dataPath,
    JSON.stringify(
      {
        ...data,
      },
      null,
      2,
    ),
  );
};

const updateContractData = ({ abi, networks }) => {
  // only update if a testnet build exists
  if (networks[3] && networks[3].address) {
    const address = networks[3].address;
    const dataPath = path.join(__dirname, '../client/src/contract-data.json');
    writeContractData({ abi, address }, dataPath);
  }

  // only update if a development build exists
  if (networks[5777] && networks[5777].address) {
    const address = networks[5777].address;
    const dataPath = path.join(
      __dirname,
      '../client/src/contract-data-dev.json',
    );
    writeContractData({ address }, dataPath);
  }
};

module.exports = deployer =>
  deployer.deploy(Sbp).then(() => {
    const json = Sbp.toJSON();
    updateContractData(json);
  });
