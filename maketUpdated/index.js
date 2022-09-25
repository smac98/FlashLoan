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
	
	const markets = await Promise.all(_.map(token_name_path9, market => createMarkets(market)));
    return markets;
   };

   const updateMarkets = async(markets, provider)=>{
    //const provider = new ethers.providers.JsonRpcProvider(process.env.url);
    provider.on('block', async (block) => {
    console.log(block);
    await updateReserves(provider, markets);
     const sendVals = await Promise.all(_.map(markets, market => CoinMarket.sendMarkets(market)));
    });
   };

