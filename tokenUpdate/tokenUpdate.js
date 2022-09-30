const request = require("request-promise");
require('dotenv').config()

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const tokenRelativePriceName = async (address,chain) => {
  
  var PriceCoingeckoOptions = {
        method: "GET",
        url: `https://deep-index.moralis.io/api/v2/erc20/${address}/price?chain=${chain}`,
        headers: {'X-API-Key': `${process.env.tokenKey}`},
      };
      console.log(PriceCoingeckoOptions);
    await sleep(10000) ; 
    const PriceJSON = JSON.parse( await request.get(PriceCoingeckoOptions));
    console.log(PriceJSON.nativePrice.name,PriceJSON.usdPrice, address);
    return (PriceJSON.nativePrice.name,PriceJSON.usdPrice);
  };

  const swapToken = ()=>{
    
  };
   tokenRelativePriceName('0xd6df932a45c0f255f85145f286ea0b292b21c90b','polygon');
   tokenRelativePriceName('0x013f9c3fac3e2759d7e90aca4f9540f75194a0d7','polygon');
   tokenRelativePriceName('0x1c954e8fe737f99f68fa1ccda3e51ebdb291948c','polygon');
   
module.exports={tokenRelativePriceName};