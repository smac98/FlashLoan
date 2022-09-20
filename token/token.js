class token {
    constructor(address,relativePrice, name, decimal){
        this.address = address;
        this.relativePrice = relativePrice;
        this.name = name;
        this.decimal = decimal;
    }
    get getDecimal(){
        
    }
    get getaddress(){
        return this.address;
    }
    get getRelativePrice(){
        return  this.relativePrice;
    }
    get getName(){
        return  this.name
    }

    set setName(name){
        this.name = name ;
    }
    set setaddress(address){
        this.address = address;
    }

    set setrelativePrice(relativePrice){
        this.relativePrice = relativePrice;
    }
}
exports.token = token;