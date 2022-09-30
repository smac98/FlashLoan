//jji
const {findAll,
    creatTokenRelation,
    findByMarketAddress,
    findTopTenMakretPD0,
    findTopTenMakretPD1,
    createMarket,
    findByAddressAndUpdate,
    findByAddressAndDelete} = require("../market/marketCall");
require("dotenv").config();
const {CoinMarket} = require('../coinMarket/coinMarket')
const fs = require("fs");
const {market} = require('../market/markets');
const { ethers } = require("ethers");
const pullMarkets  = async () => {
    let allMarkets = await findAll();
    let allAddress=allMarkets.map((market) =>  createMarkets(market));
   // console.log(allAddress)
    var json = JSON.stringify(allAddress);
    fs.writeFile(
      `./market.json`,
      json,
      "utf8",
      function (err) {
        if (err) return console.log(err);
        console.log("Note added");
      }
    );
    };

    const createMarkets = (market)=>{
        const uniswappyV2EthPair = new CoinMarket(
            market.address,
            [market.token0, market.token1],
            market.dexName
          );
        return uniswappyV2EthPair
    }
   const readJsonMarket = async()=>{
    const jsonString = fs.readFileSync('./market.json');
    const token_name_path9 = JSON.parse(jsonString);
  //   implment portion 
	  const markets = await Promise.all(_.map(token_name_path9, market => createMarkets(market)));
    return markets;
   };

   const portion  =  (numOfInstances, index , jsonArray)=>{
     let amoutProcessed = jsonArray.length / numOfInstances
    let  end = amoutProcessed * index;
    let start = end  -  amoutProcessed;
    if (index != 4){
    return (start, end -1);
    }
    else {
      return (start, jsonArray.length -1);
    }
   };

   const updateMarkets = async(markets, provider)=>{
    //const provider = new ethers.providers.JsonRpcProvider(process.env.url);
    const startBlock = await provider.getBlockNumber()
    provider.on('block', async (block) => {
    console.log(block);
    await updateReserves(provider, markets);
    const sendVals = await Promise.all(_.map(markets, market => CoinMarket.sendMarkets(market)));
    await swapBlock(block, startBlock,markets, provider);
  });
  
   };

// swap provider 
   const swapBlock = async(endBlock, startBlock,markets, provider) => {
    if(endBlock - startBlock > 30 ) {
      provider.off('block',[block]);
      let url;
      switch (provider.apiKey()) {
        case process.env.infuraApi:
          url = process.env.infura2
        break;
        case process.env.infuraApi2:
          url =  process.env.infura
        break;
        default:
          url =  process.env.infura
      }
      const newProvider = new ethers.providers.JsonRpcProvider(url)
      await updateMarkets(markets, newProvider);
    }
    
   };
   module.exports = {
 pullMarkets,  
 updateMarkets,
 portion,
 readJsonMarket,
   };