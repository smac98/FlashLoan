require('dotenv').config()
const {updateMarkets,readJsonMarket,} = require("./maketUpdated");
const { ethers } = require("ethers");
const {updateTokenFromJson} = require('./tokenUpdate');
const provider = new ethers.providers.JsonRpcProvider(process.env.infura);
console.log(provider.apiKey,process.env.infura )
async function main(){
  await readJsonMarket().then(async(markets)=>{
    await updateTokenFromJson();
    await updateMarkets(markets,provider);
  });
 
};
main();