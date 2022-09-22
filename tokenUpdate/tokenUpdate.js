const request = require("request-promise");
//QEwyUOKgiUXxR1cwubhGWby5lL7s4NzP4x7TMqVN93KDSpH3URdKwLKVuvmF6C0P
  
const tokenRelativePriceName = async (address,chain) => {
    var PriceCoingeckoOptions = {
        method: "GET",
        url: `https://deep-index.moralis.io/api/v2/erc20/${address}/price?chain=${chain}`,
        headers: {'X-API-Key': `${process.env.tokenKey}`},
      };
    const PriceJSON = JSON.parse(await request.get(PriceCoingeckoOptions));
    console.log(PriceJSON.nativePrice.name,PriceJSON.usdPrice);
    return (PriceJSON.nativePrice.name,PriceJSON.usdPrice)
  };
  tokenRelativePriceName();