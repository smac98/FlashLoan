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
    console.log(PriceJSON.nativePrice.name,PriceJSON.usdPrice, PriceJSON);
    return {name: PriceJSON.nativePrice.name, price: PriceJSON.usdPrice};
  };

//   const swapToken = (address,chain)=>{
//     const url =`https://deep-index.moralis.io/api/v2/erc20/${address}/price?chain=${chain}`,
//     const options = {
//   method: 'GET',
//   headers: { 'Accept': 'application/json', 'X-API-Key': `${process.env.tokenKey}`},
// };
// fetch(`${url}`, options)
//   .then((response) => response.json())
//   .then((response) => {
//     const PriceJSON = JSON.parse(response)

//     console.log(PriceJSON.nativePrice.name,PriceJSON.usdPrice, address);
    
//   })
//   .catch((err) => console.error(err))

  
//   };
//   swapToken('0xd6df932a45c0f255f85145f286ea0b292b21c90b','polygon');
tokenRelativePriceName('0xb33eaad8d922b1083446dc23f610c2567fb5180f','polygon')
module.exports={tokenRelativePriceName};