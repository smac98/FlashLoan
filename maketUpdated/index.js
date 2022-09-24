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
   const readJson = async()=>{
    
   };
    pullMarkets();