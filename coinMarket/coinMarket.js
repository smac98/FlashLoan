const { EVMUniClone } = require("./tokenMarkets");
const { addresses  } = require("../polygon/address");
const abi = require("../polygon/abi");
const { ethers, BigNumber, formatEther } = require("ethers");
const BATCH_COUNT_LIMIT = 20;
const UNISWAP_BATCH_SIZE = 100;
const _ = require("lodash");
const {token} = require('../token/token');
const {market}= require('../market/markets')
const {createToken, findByAddress, findByAddressAndUpdateDEC} = require("../token/baseTokenCall");
const { createMarket, creatTokenRelation, findByAddressAndUpdate} = require("../market/marketCall");
const blacklistTokens = [];
var fs = require("fs");
class CoinMarket extends EVMUniClone {
  constructor(marketAddress, tokens, protocol) {
    super(marketAddress, tokens, protocol);
    this._protocol = protocol;
    this._tokenBalances = _.zipObject(tokens, [
      BigNumber.from(0),
      BigNumber.from(0),
    ]);
    this._tokenDecimal = _.zipObject(tokens, [
     Number,
     Number,
    ]);
    this._tokenPricesDEC = _.zipObject(tokens, [
      Number,
      Number,
     ]);
     this._tokenBalancesDEC = _.zipObject(tokens, [
      Number,
      Number,
     ]);
  }
  // gather chain addresses based on uni-Factory Adress and denominatin token
  static async getUniswappyMarkets(provider, factoryAddress, addressToken) {
    const uniswapQuery = new ethers.Contract(
      addresses.UNIV2Qdec,
      abi.UNISWAP_QUERY_ABI_DEC,
      provider
    );
    const marketPairs = new Array();
    for (
      let i = 0;
      i < BATCH_COUNT_LIMIT * UNISWAP_BATCH_SIZE;
      i += UNISWAP_BATCH_SIZE
    ) {
      var pairs = (
        await uniswapQuery.functions.getPairsByIndexRange(
          factoryAddress,
          i,
          i + UNISWAP_BATCH_SIZE
        )
      )[0];
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        const marketAddress = pair[2];
        let tokenAddress;
        if (pair[0].toLowerCase() === addressToken.toLowerCase()) {
          tokenAddress = pair[1];
        } else if (pair[1].toLowerCase() === addressToken.toLowerCase()) {
          tokenAddress = pair[0];
        } else {
          continue;
        }
        if (!blacklistTokens.includes(tokenAddress.toLowerCase())) {
          const uniswappyV2EthPair = new CoinMarket(
            marketAddress,
            [pair[0].toLowerCase(), pair[1].toLowerCase()],
            "uni"
          );
          marketPairs.push(uniswappyV2EthPair);
        }
    }
      if (pairs.length < UNISWAP_BATCH_SIZE) {
        break;
      }
    }
    return marketPairs;
  }
  //sleep func
  static sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // creation of markets and filling db
  static async getUniswapMarketsByToken(provider, factoryAddresses) {
    const list_arr = Array();
    for (const [token_name, address] of Object.entries(addresses.TOKEN)) {
      // check
      // if (await CoinMarket.checkCoinJson(token_name)) {
      //   continue;
      // }
      const allPairs = await Promise.all(
        _.map(factoryAddresses, (factoryAddress) =>
          CoinMarket.getUniswappyMarkets(provider, factoryAddress, address)
        )
      );
      const marketsByTokenAll = _.chain(allPairs)
        .flatten()
        .groupBy((pair) =>
          pair.tokens[0] === address ? pair.tokens[1] : pair.tokens[0]
        )
        .value();

      const allMarketPairs = _.chain(
        _.pickBy(marketsByTokenAll, (a) => a.length > 1) // weird TS bug, chain'd pickBy is Partial<>
      )
        .values()
        .flatten()
        .value();
      
      await CoinMarket.updateReserves(provider, allMarketPairs);
      // const marketsByToken = _.chain(allMarketPairs)
      //   .filter((pair) =>
      //       this.getPairBalance(pair.getBalance(address), 100000, address)
      //   )
      //   .groupBy((pair) =>
      //     pair.tokens[0] === address ? pair.tokens[1] : pair.tokens[0]
      //   )
      //   .value();
        
      const allLargeMarketPairs = await Promise.all(_.chain(
        allMarketPairs // weird TS bug, chain'd pickBy is Partial<>
      )
        .values()
        .flatten()
        .value()
        );
        await this.sleep(100);
       
        const res2 = await Promise.all( _.map(allLargeMarketPairs, (pair) => CoinMarket.getPairBalance( 1000000, address.toLowerCase(), pair)));
       
        const marketsByToken = _.chain(res2) .values()
        .flatten()
        .value();
        //console.log(marketsByToken);
        const res = await Promise.all( _.map(marketsByToken,(pair) => CoinMarket.sendMarkets(pair)));
      }
    return list_arr;
  }
//
  static  async percentDif(currentP,price){
    let priceDif = ((currentP-price)/((currentP+price)/2))*100;
    return priceDif
  }
  //
  static async tokenCheck(tokenAddress,tokenPrice, tokenDecimal){
    try {
        const found = await findByAddress(tokenAddress);
        if (found != null){
          if  (found.decimal === 0 ){
            found.decimal = tokenDecimal;
           let final = await findByAddressAndUpdateDEC(found);
           return final;
          }
          return found;
        }
        else {
          let newToken = new token(tokenAddress,tokenPrice,"unin", tokenDecimal)
          let tokenAdd = await createToken(newToken);
          return tokenAdd;
        }
    } catch (error) {
        
        let newToken = new token(tokenAddress,tokenPrice,"unin")
        let tokenAdd = await createToken(newToken);
        return tokenAdd;
    }
    
  }
  //
  static async checkMarket(market){
    await this.sleep(100);

    try {
    
      const found = await findByMarketAddress(market);
      if (found != null){
        let res2 = await creatTokenRelation(market);
        return res2;
      }
      else{
        let marketAdd = await createMarket(market);
        let res2 = await creatTokenRelation(market);
        return marketAdd;
      }
  } catch (error) {
      let marketAdd = await createMarket(market);
      let res2 = await creatTokenRelation(market);
      return marketAdd;
  }
  }
  //
  static  getCurrentBal(bal0,bal1){
    const final = (bal0/bal1);
    return final;
  }
  //
  static priceCalc(bal0,bal1){
    if (bal0 > bal1 ){
      const bal0dif = bal0 / bal1;
      const  bal1dif = bal1 / bal0;
      return [bal0dif, bal0dif * bal1dif]
    }
    else  {
      const bal1dif = bal1 / bal0;
      const  bal0dif = bal0 / bal1;
      return [bal0dif * bal1dif, bal1dif]
    }
  }
  //
  static  async sendMarkets(pair){
    // add other token.....  
    const token_price0 = await CoinMarket.tokenCheck(pair._tokens[0],pair._tokenPricesDEC[pair._tokens[0]],pair._tokenDecimal[pair._tokens[0]]);
    const token_price1 = await CoinMarket.tokenCheck(pair._tokens[1],pair._tokenPricesDEC[pair._tokens[1]],pair._tokenDecimal[pair._tokens[1]]);
    let pd0 = await CoinMarket.percentDif(pair._tokenPricesDEC[pair._tokens[0]],token_price0.relativePrice);
    let pd1 = await CoinMarket.percentDif(pair._tokenPricesDEC[pair._tokens[1]],token_price1.relativePrice);
    const marketUpload = new market(pair._marketAddress,pair._protocol,pd0,pd1,pair._tokenBalancesDEC[pair._tokens[0]],pair._tokenBalancesDEC[pair._tokens[1]],pair._tokens[0], pair._tokens[1]);
    let res = CoinMarket.checkMarket(marketUpload);
    return res;
  }

  static async sendUpdate(pair){
    let t0 = await findByAddress(pair._tokens[0]);
    let t1 = await findByAddress(pair._tokens[0]);
    let pd0 = await CoinMarket.percentDif(pair._tokenPricesDEC[pair._tokens[0]],t0.relativePrice);
    let pd1 = await CoinMarket.percentDif(pair._tokenPricesDEC[pair._tokens[1]],t1.relativePrice);
    const marketUpload = new market(pair._marketAddress,pair._protocol,pd0,pd1,pair._tokenBalancesDEC[pair._tokens[0]],pair._tokenBalancesDEC[pair._tokens[1]],pair._tokens[0], pair._tokens[1]);
    const final = await findByAddressAndUpdate(marketUpload);
    return final;
  }
  // call the view unit swap function to update all market data including balances and prices
  static async updateReserves(provider, allMarketPairs) {
    const uniswapQuery = new ethers.Contract(
      addresses.UNIV2Qdec,
      abi.UNISWAP_QUERY_ABI_DEC,
      provider
    );
   // console.log(allMarketPairs)
    const pairAddresses = allMarketPairs.map(
      (marketPair) => marketPair.marketAddress
    );
  //  console.log("Updating markets,nn count: \n", pairAddresses);
    const res = (await uniswapQuery.functions.getReservesByPairs(pairAddresses));
    const {0: reserves, 1: decimals } = res;
    console.log("Updating markets, count:",reserves.length);
    for (let i = 0; i < allMarketPairs.length; i++) {
    
      const marketPair = allMarketPairs[i];
      const decimal = decimals[i];
      const reserve = reserves[i];
     //console.log(marketPair._marketAddress);
      marketPair.setReservesViaOrderedBalances(
        [reserve[0], reserve[1]],
        [decimal[0], decimal[1]]
      );
    }
  }
  // Use local token creation to update and pricelast
  getPrice(tokenAddress) {
    const price = this._tokenPrices[tokenAddress];
    if (price === undefined) throw new Error("bad token");
    return price;
  }
  // get last Balance of token
  getBalance(tokenAddress) {
    const balance = this._tokenBalances[tokenAddress];
   // console.log(this._tokenBalances ,this._tokenBalances['0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'])
    if (balance === undefined) throw new Error("bad token");
    return balance;
  }
  //
  static toDecimalDE(pairtoken_ball, dec){
    
    const num = pairtoken_ball.toString() / 10 ** dec;
    //console.log(` bit ${pairtoken_ball.toString() }, ${num}`);
    return num;
  }
  //
  static toDecimal(pairtoken_ball){
    
    const num = pairtoken_ball.toString() / 10 ** 6;
    //console.log(` bit ${pairtoken_ball.toString() }, ${ethers.utils.commify( num)}`)
    return num;
  }
  //
  static async getPairBalance( minCap,address, pair){
    const as = Array()
    const token_amount_liqud = pair._tokenPricesDEC[address]* pair._tokenBalancesDEC[address];
    if (minCap <= token_amount_liqud) {
      as.push(pair)
      return as;
      }
      return as;
  }
  //
  setReservesViaOrderedBalances(balances, decimals) {
    this.setReservesViaMatchingArray(this._tokens, balances, decimals);
  }
  //
  setReservesViaMatchingArray(tokens, balances, decimals) {
    const tokenBalances = _.zipObject(tokens, balances);
    const tokenDecimals= _.zipObject(tokens, decimals);
    const tokenBalDEC = _.zipObject(tokens,[CoinMarket.toDecimalDE(balances[0],decimals[0]), CoinMarket.toDecimalDE(balances[1],decimals[1])])
    const tokenPrice = _.zipObject(tokens,CoinMarket.priceCalc(tokenBalDEC[tokens[0]],tokenBalDEC[tokens[1]]))
    if (
      !_.isEqual(this._tokenBalances, tokenBalances)
    ) {
      this._tokenBalances = tokenBalances;
      this._tokenDecimal = tokenDecimals;
      this._tokenBalancesDEC= tokenBalDEC;
      this._tokenPricesDEC = tokenPrice;
    }
  }
  //
  static async makeMarkets(){}
  
}
exports.CoinMarket = CoinMarket;
