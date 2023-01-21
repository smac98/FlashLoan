require("dotenv").config({ path: "../.env" });
console.log(process.env.url);
const neo4j = require("neo4j-driver");
const { url, db_username, db_password } = process.env;
const driver = neo4j.driver(url, neo4j.auth.basic(db_username, db_password), {
  disableLosslessIntegers: true,
});
const { createToken, findByAddress } = require("../token/baseTokenCall");

const findPath = async (address) => {
  const session = driver.session();
  const result = await session.run(`
   with '${address}' as curAddy
    CALL apoc.search.nodeAll(
        {Market:["token0"] },"contains", curAddy
    ) YIELD node AS n0
    with n0 ORDER BY n0.price0 limit 1
    with '${address}' as curAddy , n0 as newN0
    CALL apoc.search.nodeAll(
        {Market:["token1"] },"contains", curAddy
    ) YIELD node AS n1
    with newN0  as nn0, n1 ORDER BY n1.price1 limit 1 
    return [nn0, n1]
    
  `); //case find next market with lower price  -- fix price mismatch in maket -- fill path or loop to get more then 5 markets -- fix price eval
  /** 
    CALL apoc.do.when(n1.price1 >= nn0.price0, 
    'return [nn0,nn0.token1]',
    'return [n1,n1.token0]'
    ,{n1:n1 , nn0:nn0 }) YIELD value AS result 
     CALL apoc.search.nodeAll(
        {Market:["token0","token1"] },"contains", '${address}'
    );
  MATCH (u:Token {address:'${address}'})
    where ((u)-[:TOKEN]-(mark:Market)) as p
    return path
    MATCH (u:Market) 
    WHERE (u.token1='${address}') or (u.token0='${address}') 
    WITH u as ut
    FOREACH ( n in range(0,4) MATCH (newMark:Market) WHERE (u.token1='${address}') or (u.token0='${address}')  order by  limit 1| with [ n in L1 where x > l2] )
    CALL apoc.do.when(ut.token0='${address}', 
    '
    MATCH (newMark:Market)
    where  (ut.token1 = newMark.token1) or (ut.token1=newMark.token0) and (ut.price1 >= newMark.price1) or (ut.price1  >=  newMark.price0) 
    WITH [ut,newMark] AS coll
    return coll ', 
    'return ut.token1',
    {ut :ut}) YIELD value AS result
    return result
  * */
  await endSession(session);
  // console.log(result.records)
  const maspd = result.records.map((i) => i._fields);
  console.log(maspd.map((i) => i[0]));
  return maspd.map((i) => i[0]);
};
const findNextToken = async (address) => {
  const session = driver.session();
  const result = await session.run(`
  with '${address}' as curAddy
   CALL apoc.search.nodeAll(
       {Market:["token0"] },"contains", curAddy
   ) YIELD node AS n0
   with n0 ORDER BY n0.price0 limit 1
   with '${address}' as curAddy , n0 as newN0
   CALL apoc.search.nodeAll(
       {Market:["token1"] },"contains", curAddy
   ) YIELD node AS n1
   with newN0  as nn0, n1 ORDER BY n1.price1 limit 1 
   CALL apoc.do.when(n1.price1 >= nn0.price0, 
   'return [nn0,nn0.token1]',
   'return [n1,n1.token0]'
   ,{n1:n1 , nn0:nn0 }) YIELD value AS result 
   return result
   
 `); 
};

const findAll = async () => {
  const session = driver.session();
  const result = await session.run(`Match (u:Market) return u`);
  await endSession(session);
  return result.records.map((i) => i.get("u").properties);
};
const findTopTenMakretPD0 = async () => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (u:Market) WHERE (u.balanceToken0 >= 1) and (u.balanceToken1 >= 1)  return u ORDER BY u.priceDif0 DESC limit 4`
  );
  await endSession(session);
  return result.records.map((i) => i.get("u").properties);
};

const findTopTenMakretPD1 = async () => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (u:Market) WHERE  (u.balanceToken0 >= 1) and (u.balanceToken1 >= 1) return u ORDER BY u.priceDif1 DESC limit 6`
  );
  await endSession(session);
  return result.records.map((i) => i.get("u").properties);
};

const creatTokenRelation = async (market) => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (u:Market), (t0:Token ), (t1:Token) WHERE u.address='${market.address}' AND t0.address='${market.token0}' AND t1.address='${market.token1}'   CREATE (u)-[r:TOKEN]->(t1),(u)-[r0:TOKEN]->(t0) return u,t0,t1`
  );
  await endSession(session);
  return result.records[0].get("u").properties;
};

const findByMarketAddress = async (market) => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (u:Market {address : '${market.address}'} ) return u limit 1`
  );
  await endSession(session);
  try {
    return result.records[0].get("u").properties;
  } catch (error) {
    return null;
  }
};
const createMarket = async (market) => {
  const session = driver.session();
  await session.run(
    `CREATE (u:Market {address : '${market.address}', dexName: '${market.dexName}', price0: ${market.price0}, price1: ${market.price1}, priceDif0: ${market.priceDif0}, priceDif1: ${market.priceDif1}, balanceToken0: ${market.balanceToken0}, balanceToken1: ${market.balanceToken1}, token1: '${market.token1}', token0: '${market.token0}' } ) return u`
  );
  const res = await findByMarketAddress(market);
  await endSession(session);
  return res;
};
const findByAddressAndUpdate = async (market) => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (u:Market {address : '${market.address}'}) SET u.priceDif0= ${market.priceDif0} , u.priceDif1 = ${market.priceDif1}, u.balanceToken0= ${market.balanceToken0}, u.balanceToken1= ${market.balanceToken1}  , u.price0= ${market.price0}, u.price1= ${market.price1} return u`
  );
  await endSession(session);
  return result.records[0].get("u").properties;
};
const findByAddressAndDelete = async (market) => {
  const session = driver.session();
  await session.run(
    `MATCH (u:Market {address : '${market.address}'}) DELETE u`
  );
  let res = await findAll();
  await endSession(session);
  return res;
};

const endSession = async (session) => {
  session.close();
};

module.exports = {
  findAll,
  findPath,
  creatTokenRelation,
  findByMarketAddress,
  findTopTenMakretPD0,
  findTopTenMakretPD1,
  createMarket,
  findByAddressAndUpdate,
  findByAddressAndDelete,
};

/**
MATCH p=(f:Company)-[:HAS_INVOICE*1..10]->(t:Company) 
WHERE all(r IN relationships(p) WHERE r.invoiceState in ['DUE', 'OVERDUE'])
RETURN p;

**/
