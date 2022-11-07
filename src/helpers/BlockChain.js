const Web3 = require('web3')
import { network } from './controllers/index';
console.log(network)
module.exports = function (app) {
	app.configureWeb3 = configureWeb3
 
	function configureWeb3 (config) {
		return new Promise((resolve, reject) => {
             console.log(network)

			 var newWeb3 =function (network){
			
					if(network==="devnet"){
						return"devnet";
					}
					else{
						return"rpc";
					}
			}
			let web3
            // var newWeb3=network
			if (typeof web3 !== 'undefined') {
				web3 = new Web3(web4.currentProvider)
			}
			else {
				web3 = new Web3(new Web3.providers.HttpProvider(config.Ethereum[config.environment].newWeb3))
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
}