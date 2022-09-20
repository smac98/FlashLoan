class market {
    constructor(address,dexName, priceDif0,priceDif1,balanceToken0,balanceToken1,token0, token1){
        this.address = address;
        this.dexName = dexName;
        this.priceDif0 = priceDif0;
        this.priceDif1 = priceDif1;
        this.balanceToken0 = balanceToken0;
        this.balanceToken1 = balanceToken1;
        this.token0 = token0;
        this.token1 = token1;
    }
    get getaddress(){
        return this.address;
    }
    get getPriceDif0(){
        return  this.priceDif0;
    }
    get getPriceDif1(){
        return  this.priceDif1;
    }
    get getdexName(){
        return  this.dexName;
    }
    get getbalanceToken0(){
        return this.balanceToken0;
    }
    get getbalanceToken1(){
        return this.balanceToken1;
    }
    get gettoken1(){
        return this.token1;
    }
    get gettoken0(){
        return this.token0;
    }

    set setaddress(address){
        this.address = address;
    }

    set setPriceDif0(priceDif0){
       this.priceDif0 = priceDif0;
    }
    set setPriceDif1(priceDif1){
        this.priceDif1 = priceDif1;
    }
    set setdexName(dexName){
        this.dexName= dexName;
    }
    set setbalanceToken0(balanceToken0){
        this.balanceToken0 = balanceToken0;
    }
    set setbalanceToken1(balanceToken1){
         this.balanceToken1 = balanceToken1;
    }
    set settoken1(token1){
     this.token1 = token1;
    }
    set settoken0(token0){
        this.token0 = token0;
    }

}
exports.market = market;
