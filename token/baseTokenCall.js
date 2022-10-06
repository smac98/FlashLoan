require('dotenv').config({ path: '../.env' })
const neo4j = require("neo4j-driver");
const token = require("./token");
const fs = require('fs');
const _ = require("lodash");

const {
    url,
    db_username,
    db_password
} = process.env
const driver = neo4j.driver(url, neo4j.auth.basic(db_username, db_password))


const session = driver.session();

const findAll = async () =>{
    const session = driver.session();
    const result = await session.run(`Match (u:Token) return u`)
    await endSession(session);
    return result.records.map(i=>i.get('u').properties)
}

const findByAddress = async (address) =>{
    const session = driver.session();
    const result = await session.run(`MATCH (u:Token {address : '${address}'} ) return u limit 1`)
    await endSession(session);
    try {
       return result.records[0].get('u').properties;
    }
    catch (error){
        return null;
    }
    
}
const createToken = async (token) =>{
    const session = driver.session();
    console.log(token);
    await session.run(`CREATE (u:Token {address : '${token.address}', name: '${token.name}', relativePrice: ${token.relativePrice}, decimal: ${token.decimal}} ) return u`)   
    const res = await findByAddress(token.address);
    await endSession(session);   
    return res;
}   
const findByAddressAndUpdate = async (token) =>{
    const session = driver.session();
    const result = await session.run(`MATCH (u:Token {address : '${token.address}'}) SET u.relativePrice= ${token.relativePrice} return u`)
    
    await endSession(session);   
    var json = JSON.stringify(result.records[0].get('u').properties);
    fs.writeFile(
	      `./tokens-ans.json`,
	      json,
	      "utf8",
	      function (err) {
	        if (err) return console.log(err);
	        console.log("Note added");
	      }
	    ); 
    console.log(result.records[0].get('u').properties)
    return result.records[0].get('u').properties
}

const findByAddressAndUpdateDEC = async (token) =>{
    const session = driver.session();
    console.log(token);
    const result = await session.run(`MATCH (u:Token {address : '${token.address}'}) SET u.decimal= ${token.decimal} return u`)
    await endSession(session);    
    return result.records[0].get('u').properties
}

const findByAddressAndDelete = async (token) =>{
    await session.run(`MATCH (u:Token {address : '${token.address}'}) DELETE u`)   
    return await findAll()
}

const endSession = async() => {
    session.close();
}

module.exports = {
    findAll,
    findByAddressAndUpdateDEC,
    findByAddress,
    createToken,
    findByAddressAndUpdate,
    findByAddressAndDelete
};