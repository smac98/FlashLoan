require('dotenv').config()
const {updateMarkets,readJsonMarket,} = require("./maketUpdated");
const { ethers } = require("ethers");
const {updateTokenFromJson} = require('./tokenUpdate');
const {FACTORY_ADDRESSES, addresses , WETH_ADDRESS} = require('./polygon/address')
const request = require('request-promise');

const { CoinMarket } = require('./coinMarket/coinMarket');
const network ='mainnet';
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
 
    //tokenPop()
      let market = await CoinMarket.getUniswapMarketsByToken(provider, addresses.FACTORY);
      provider.on('block', async (block) => {
        //  await CoinMarket.updateReserves(provider, market.allMarketPairs);
      });
  

  //  let long= await findTopTenMakretPD0();
//  let long2= await findTopTenMakretPD1();
//   await readJsonMarket().then(async(markets)=>{
//     await updateTokenFromJson();
//     await updateMarkets(markets,provider);
//   });
 //console.log(long)
 //console.log(long2)
 //
 
};
main();