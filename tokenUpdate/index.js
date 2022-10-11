// 
const neo4j = require("neo4j-driver");
const {token} = require("../token/token");
const {tokenRelativePriceName} = require("./tokenUpdate");
require('dotenv').config({ path: '../.env' })
const { findAll,findByAddressAndUpdateDEC,findByAddress,findByAddressAndUpdate,findByAddressAndDelete } = require("../token/baseTokenCall");
const fs = require('fs');
const _ = require("lodash");

const portion  =  (numOfInstances, index , jsonArray)=>{
	let amoutProcessed = jsonArray.length / numOfInstances
   let  end = amoutProcessed * index;
   let start = end  -  amoutProcessed;
   if (index != 4){
   return (start, end -1);
   }
   else {
	 return (start, jsonArray.length -1);
   }
  };

const updateTokenFromJson = async () => {
	const jsonString = fs.readFileSync(require.resolve('./tokens.json'));
	const token_name_path9 = JSON.parse(jsonString);
	let addry = new Array()
	const {start,finish}=portion(process.env.instanceAmount,process.env.indexNumber,token_name_path9);
	addry=token_name_path9.splice(start,finish);
	for await (const results of addry) {
		await sleep(210);
		await  Update(results);
	  }
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


module.exports = {
 writeToJson ,
 updateTokenFromJson
};
