const neo4j = require('neo4j-driver');
require('dotenv').config()
const {
    url,
    db_username,
    db_password,
} = process.env
const driver = neo4j.driver(url, neo4j.auth.basic(db_username, db_password));
const {createToken,findByAddress} = require("../token/baseTokenCall");



const findAll = async () =>{
    const session = driver.session();
    const result = await session.run(`Match (u:Market) return u`)
    await endSession(session);    
    return result.records.map(i=>i.get('u').properties)
}
const findTopTenMakretPD0 = async () =>{
    const session = driver.session();
    const result = await session.run(`MATCH (u:Market) WHERE (u.priceDif0 >= 0.08) return u ORDER BY u.priceDif0 DESC limit 6`)
    await endSession(session);    
    return result.records[0].get('u').properties
}

const findTopTenMakretPD1 = async () =>{
    const session = driver.session();
    const result = await session.run(`MATCH (u:Market) WHERE (u.priceDif1 >= 0.008) return u ORDER BY u.priceDif1 DESC limit 6`)
    await endSession(session);    
    return result.records[0].get('u').properties
}

const creatTokenRelation = async (market) => {
    const session = driver.session();
    const result = await session.run(`MATCH (u:Market), (t0:Token ), (t1:Token) WHERE u.address='${market.address}' AND t0.address='${market.token0}' AND t1.address='${market.token1}'   CREATE (u)-[r:TOKEN1]->(t1),(u)-[r0:TOKEN0]->(t0) return u,t0,t1`)
    await endSession(session);
    return result.records[0].get('u').properties
}


const findByMarketAddress = async (market) =>{
    const session = driver.session();
    const result = await session.run(`MATCH (u:Market {address : '${market.address}'} ) return u limit 1`)
    await endSession(session);    
    return result.records[0].get('u').properties
}
const createMarket = async (market) =>{
    const session = driver.session();
    await session.run(`CREATE (u:Market {address : '${market.address}', dexName: '${market.dexName}', priceDif0: ${market.priceDif0}, priceDif1: ${market.priceDif1}, balanceToken0: ${market.balanceToken0}, balanceToken1: ${market.balanceToken1}, token1: '${market.token1}', token0: '${market.token0}' } ) return u`)
    const res = await findByMarketAddress(market)
    await endSession(session);   
    return res;
}
const findByAddressAndUpdate = async (market) =>{
    const session = driver.session();
    const result = await session.run(`MATCH (u:Token {address : '${market.address}'}) SET u.priceDif0= ${market.priceDif0} , u.priceDif1 = ${market.priceDif1}, u.balanceToken0= ${market.balanceToken0}, u.balanceToken1= ${market.balanceToken1} return u`)
    await endSession(session);    
    return result.records[0].get('u').properties
}
const findByAddressAndDelete = async (market) =>{
    const session = driver.session();
    await session.run(`MATCH (u:Market {address : '${market.address}'}) DELETE u`)
    let res =  await findAll()
    await endSession(session);
    return res;
}

const endSession = async(session) => {
    session.close();
}


//LONGEST MARKET ROUTE QUERY
// MATCH (a:Market), (b:Market)
// WHERE id(a) =0 AND id(b) = 4
// WITH a,b
// MATCH p=(a)-[*]-(b)
// RETURN p, length(p) ORDER BY length(p) DESC LIMIT 1

module.exports = {
    findAll,
    creatTokenRelation,
    findByMarketAddress,
    findTopTenMakretPD0,
    findTopTenMakretPD1,
    createMarket,
    findByAddressAndUpdate,
    findByAddressAndDelete
};