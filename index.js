require('dotenv').config()
const {updateMarkets,readJsonMarket,} = require("./maketUpdated");
const { ethers } = require("ethers");
const {updateTokenFromJson} = require('./tokenUpdate');
const provider = new ethers.providers.JsonRpcProvider(process.env.infura);
console.log(provider.apiKey,process.env.infura )
const { findAll,
  creatTokenRelation,
  findByMarketAddress,
  findTopTenMakretPD0,
  findTopTenMakretPD1,
  createMarket,
  findByAddressAndUpdate,
  findByAddressAndDelete} = require("./market/marketCall")
async function main(){
 let long= await findTopTenMakretPD0();
 let long2= await findTopTenMakretPD1();
  // await readJsonMarket().then(async(markets)=>{
  //   await updateTokenFromJson();
  //   await updateMarkets(markets,provider);
  // });
 
  console.log(long)
 console.log(long2)
 
};
main();