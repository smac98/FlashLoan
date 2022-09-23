//write the pull alll tokens 
//send to json 
// make updates to  token portion  
//  call updateapi and set in resolver 
// 
const neo4j = require("neo4j-driver");
const token = require("../token/token");
const { findAll,findByAddressAndUpdateDEC,findByAddress,findByAddressAndUpdate,findByAddressAndDelete } = require("../token/baseTokenCall");

