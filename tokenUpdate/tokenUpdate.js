const request = require("request-promise");
require('dotenv').config()

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const tokenRelativePriceName = async (address,chain) => {
  let token = swapTokenApi();
  var PriceCoingeckoOptions = {
        method: "GET",
        url: `https://deep-index.moralis.io/api/v2/erc20/${address}/price?chain=${chain}`,
        headers: {'X-API-Key': `${token}`},
      };

      console.log(PriceCoingeckoOptions);
    await sleep(10000) ; 
    const PriceJSON = JSON.parse( await request.get(PriceCoingeckoOptions));
    console.log(PriceJSON.nativePrice.name,PriceJSON.usdPrice, PriceJSON);
    return {name: PriceJSON.nativePrice.name, price: PriceJSON.usdPrice};
  };


  const swapTokenApi = ()=>{
    let min = 1;
    let max = 2;
    let tokenkey;
    let randomNum = Math.random() * (max - min) + min;
    switch (randomNum) {
      case 1:
      tokenkey = process.env.block1
        break;
      case 2:
      tokenkey = process.env.block2
      break;
    
      default:
      tokenkey = process.env.block1
        break;
    }
    return tokenkey ;
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
module.exports={tokenRelativePriceName};