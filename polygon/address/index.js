const UNIV2Q = "0xEaA1c7604c602b0Ff53235407971E5308594E037";
const UNIV2QDEC = "0x16c761897BE81e512D18931c23e5ac0eaa36c890"
const SUSHISWAP_FACTORY_ADDRESS="0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
const QUICK_FACTORY_ADDRESS ='0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32'
const DFYP_FACTORY_ADDRESS="0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B";
const token_mainnet = require("./tokens.json")
const FACTORY_ADDRESSES = [
    QUICK_FACTORY_ADDRESS,
    SUSHISWAP_FACTORY_ADDRESS,
  ];
module.exports = {
    addresses: {
        UNIV2Quer: UNIV2Q,
        FACTORY: FACTORY_ADDRESSES,
        TOKEN: token_mainnet,
        UNIV2Qdec:UNIV2QDEC
    }
};