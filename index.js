const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
let app = express();
const morgan = require('morgan')

// require('./src/helpers/blockchain-helper')(app)
require('./src/helpers/blockchain-helper')(app)
let config
const configPath = './config.json'
const configExists = fs.existsSync(configPath, fs.F_OK)
if (configExists) {
	config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
} else {
	return console.log('There is no config.json file')
}
app.config = config

let web3
app.use(morgan('short'))
app.configureWeb3(config)
.then(web3 => {
	app.web3 = web3
	app.use(express.static(__dirname + '/public'))
	app.use(bodyParser.json({
		limit: '100mb',
	}))
	app.use(bodyParser.urlencoded({
		limit: '100mb',
		extended: true,
	}))

	require('./src/controllers/index')(app)

	app.get('/', function(request, response) {
	  response.send('XDC Apothem Network Faucet')
	});

	app.set('port', (process.env.PORT || 3000))

	app.listen(app.get('port'), function () {
	    console.log('XDC Apothem Network Faucet is running on port', app.get('port'))
	})
})
.catch(error => {
	return console.log(error)
})