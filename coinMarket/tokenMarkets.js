class EVMUniClone {
    constructor(marketAddress, tokens, protocol) {
        this._marketAddress = marketAddress;
        this._tokens = tokens;
        this._protocol = protocol;
    }
    get tokens() {
        return this._tokens;
    }
    get marketAddress() {
        return this._marketAddress;
    }
    get protocol() {
        return this._protocol;
    }
}
exports.EVMUniClone  = EVMUniClone;