const Web3 = require('web3')
//  module.exports = function (app) {
// function validateNetwork (app) {
		// app.configureWeb3 = configureWeb3
		function validateNetwork(config, network) {
			return new Promise((resolve, reject) => {
	
				let web3
				   
				if (typeof web3 !== 'undefined') {
					web3 = new Web3(web4.currentProvider)
				}
				else {
					// console.log("the new network is",newWeb3)
					if(network==="devnet"){
						
						web3 = new Web3(new Web3.providers.HttpProvider(config.Ethereum[config.environment].devnet))
					}
					else{
						
						web3 = new Web3(new Web3.providers.HttpProvider(config.Ethereum[config.environment].rpc))
					}
					
					
				}

				if (typeof web3 !== 'undefined') {
				
					return resolve(web3)
				}
				
				
				reject({
					code: 500,
					title: "Error",
					message: "check RPC"
				})
			});
		}

	// }

  module.exports =  {validateNetwork};

// make a new file , 
// import the function to the main file function
// use the function by passing parameter
// check the value returning by function

