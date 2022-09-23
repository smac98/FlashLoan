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
const fs = require("fs");
const pullMarkets  = async () => {
    let allMarkets = await findAll();
    let allAddress=allMarkets.map((market) => market.address);
    console.log(allAddress)
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
    
    pullMarkets();