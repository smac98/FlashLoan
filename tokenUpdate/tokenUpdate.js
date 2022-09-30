const request = require("request-promise");
require('dotenv').config()

//QEwyUOKgiUXxR1cwubhGWby5lL7s4NzP4x7TMqVN93KDSpH3URdKwLKVuvmF6C0P
  
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const tokenRelativePriceName = async (address,chain) => {
    
  var PriceCoingeckoOptions = {
        method: "GET",
        url: `https://deep-index.moralis.io/api/v2/erc20/${address}/price?chain=${chain}`,
        headers: {'X-API-Key': `${process.env.tokenKey}`},
      };
    await sleep(10000)  
    const PriceJSON = JSON.parse(await request.get(PriceCoingeckoOptions));
    console.log(PriceJSON.nativePrice.name,PriceJSON.usdPrice);
    return (PriceJSON.nativePrice.name,PriceJSON.usdPrice)
  };

  const swapToken = ()=>{

  };
  // tokenRelativePriceName('0xd6df932a45c0f255f85145f286ea0b292b21c90b','polygon');
module.exports={tokenRelativePriceName};