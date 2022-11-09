const Web3 = require('web3')

 function validateNetwork (app,config,network) {

app.configureWeb3 = configureWeb3
	function configureWeb3() {
		
		return new Promise((resolve, reject) => {    
		 var newWeb3;
					if(network==="devnet"){
						 newWeb3= "devnet";
					}
					else{
						 newWeb3="rpc";
					}
			
			let web3
		   
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
 
 module.exports =  {validateNetwork};


 