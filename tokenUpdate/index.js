// 
const neo4j = require("neo4j-driver");
const {token} = require("../token/token");
const {tokenRelativePriceName} = require("./tokenUpdate");
require('dotenv').config()
const { findAll,findByAddressAndUpdateDEC,findByAddress,findByAddressAndUpdate,findByAddressAndDelete } = require("../token/baseTokenCall");
const fs = require('fs');
const _ = require("lodash");

const callJSON = async () => {
	const jsonString = fs.readFileSync('./tokens.json');
	const token_name_path9 = JSON.parse(jsonString);
	let addry = new Array()
	addry=token_name_path9;
	console.log(addry)
	await Promise.all(addry.map(address => Update(address)));
};
//
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const Update = async(address) => {
	const {name,price} = await tokenRelativePriceName(address,'polygon');
	await sleep(10000);
	const tokenUp = new token(address,price,name);
	await findByAddressAndUpdate(tokenUp);	


};


const writeToJson = async () => {
	try {

	//write the pull alll tokens 

		const allTokens= await findAll();
		// console.log(allTokens)

		let allAddress=allTokens.map((token) => token.address);

	//send to json 
		var json = JSON.stringify(allAddress);
	    fs.writeFile(
	      `./tokens.json`,
	      json,
	      "utf8",
	      function (err) {
	        if (err) return console.log(err);
	        console.log("Note added");
	      }
	    );
	// make updates to  token portion  




	//  call updateapi and set in resolver 



	}
	finally{

	}

};

callJSON();
// module.exports = {
//  writeToJson ,
//  callJSON

// };
