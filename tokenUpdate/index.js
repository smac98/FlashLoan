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
	for await (const results of addry) {
		await sleep(200);
		await  Update(results);
	  }
	//await Promise.all(addry.map(address => Update(address)));
};
//
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const Update = async(address) => {
	
	 await tokenRelativePriceName(address,'polygon').then(async( data)  => { const tokenUp = new token(address,data.price,data.name);
		
		await findByAddressAndUpdate(tokenUp);
	});

	

	//	


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
