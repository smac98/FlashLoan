const request = require("request-promise");
var kk = 'https://deep-index.moralis.io/api/v2/erc20/0x2791bca1f2de4661ed88a30c99a7a9449aa84174/price?chain=polygon'
//const gds = `https://deep-index.moralis.io/api/v2/erc20/${token_address}/price?chain=${chain}`

  
  const tokenRelativePriceName = async (address,chain) => {
    var PriceCoingeckoOptions = {
        method: "GET",
        url: `https://deep-index.moralis.io/api/v2/erc20/${address}/price?chain=${chain}`,
        headers: {'X-API-Key': 'QEwyUOKgiUXxR1cwubhGWby5lL7s4NzP4x7TMqVN93KDSpH3URdKwLKVuvmF6C0P'},
      };
    const PriceJSON = JSON.parse(await request.get(PriceCoingeckoOptions));
    console.log(PriceJSON.nativePrice.name,PriceJSON.usdPrice);
    return (PriceJSON.nativePrice.name,PriceJSON.usdPrice)
  };
  main();