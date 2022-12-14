require('dotenv').config({ path: '../.env' })
 console.log(process.env.url)
const neo4j = require('neo4j-driver');
const {
    url,
    db_username,
    db_password,
} = process.env;
const driver = neo4j.driver(url, neo4j.auth.basic(db_username, db_password),  { disableLosslessIntegers: true });
const {createToken,findByAddress} = require("../token/baseTokenCall");

const findPath = async(address)=>{
    const session = driver.session();
    const result = await session.run(`MATCH (u:Market) WHERE (u.token1='${address}') or (u.token0='${address}') return u CASE WHERE u.price0 ='${address}' then ORDER BY u.price0 WHERE u.price1 ='${address}' then ORDER BY u.price1 else ORDER BY u.price0  limit 2`) //case
    await endSession(session);    
    //console.log(result.records.map(i=>i.get('path'))) 
    console.log(result.records.map(i=>i.get('u').properties))
    return result.records.map(i=>i.get('u').properties)

};

const findAll = async () =>{
    const session = driver.session();
    const result = await session.run(`Match (u:Market) return u`)
    await endSession(session);    
    return result.records.map(i=>i.get('u').properties)
}
const findTopTenMakretPD0 = async () =>{
    const session = driver.session();
    const result = await session.run(`MATCH (u:Market) WHERE (u.balanceToken0 >= 1) and (u.balanceToken1 >= 1)  return u ORDER BY u.priceDif0 DESC limit 4`)
    await endSession(session);    
    return result.records.map(i=>i.get('u').properties)
}

const findTopTenMakretPD1 = async () =>{
    const session = driver.session();
    const result = await session.run(`MATCH (u:Market) WHERE  (u.balanceToken0 >= 1) and (u.balanceToken1 >= 1) return u ORDER BY u.priceDif1 DESC limit 6`)
    await endSession(session);    
    return result.records.map(i=>i.get('u').properties)
}

const creatTokenRelation = async (market) => {
    const session = driver.session();
    const result = await session.run(`MATCH (u:Market), (t0:Token ), (t1:Token) WHERE u.address='${market.address}' AND t0.address='${market.token0}' AND t1.address='${market.token1}'   CREATE (u)-[r:TOKEN]->(t1),(u)-[r0:TOKEN]->(t0) return u,t0,t1`)
    await endSession(session);
    return result.records[0].get('u').properties
}


const findByMarketAddress = async (market) =>{
    const session = driver.session();
    const result = await session.run(`MATCH (u:Market {address : '${market.address}'} ) return u limit 1`)
    await endSession(session);
    try {
       return result.records[0].get('u').properties;
    }
    catch (error){
        return null;
    }
}
const createMarket = async (market) =>{
    const session = driver.session();
    await session.run(`CREATE (u:Market {address : '${market.address}', dexName: '${market.dexName}', price0: ${market.price0}, price1: ${market.price1}, priceDif0: ${market.priceDif0}, priceDif1: ${market.priceDif1}, balanceToken0: ${market.balanceToken0}, balanceToken1: ${market.balanceToken1}, token1: '${market.token1}', token0: '${market.token0}' } ) return u`)
    const res = await findByMarketAddress(market)
    await endSession(session);   
    return res;
}
const findByAddressAndUpdate = async (market) =>{
    const session = driver.session();
    const result = await session.run(`MATCH (u:Market {address : '${market.address}'}) SET u.priceDif0= ${market.priceDif0} , u.priceDif1 = ${market.priceDif1}, u.balanceToken0= ${market.balanceToken0}, u.balanceToken1= ${market.balanceToken1}  , u.price0= ${market.price0}, u.price1= ${market.price1} return u`)
    
    await endSession(session);    
    //console.log(result)
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


module.exports = {
    findAll,
    findPath,
    creatTokenRelation,
    findByMarketAddress,
    findTopTenMakretPD0,
    findTopTenMakretPD1,
    createMarket,
    findByAddressAndUpdate,
    findByAddressAndDelete
};

/**
MATCH p=(f:Company)-[:HAS_INVOICE*1..10]->(t:Company) 
WHERE all(r IN relationships(p) WHERE r.invoiceState in ['DUE', 'OVERDUE'])
RETURN p;

**/