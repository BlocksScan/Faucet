const EthereumTx = require('ethereumjs-tx')
const { generateErrorResponse } = require('../helpers/generate-response')
// const  { validateCaptcha } = require('../helpers/captcha-helper')
const { debug } = require('../helpers/debug')
const { validateNetwork } = require('../helpers/blockchain')
const { sendMail } = require('../helpers/nodeMailer')
module.exports = function (app) {
	const config = app.config
	const web3 = app.web3

	const messages = {
		INVALID_CAPTCHA: 'Invalid captcha',
		INVALID_ADDRESS: 'Invalid address',
		TX_HAS_BEEN_MINED_WITH_FALSE_STATUS: 'Transaction has been mined, but status is false',
		TX_HAS_BEEN_MINED: 'Tx has been mined',
	}

	app.post('/', async function (request, response) {
		const isDebug = app.config.debug
		debug(isDebug, "REQUEST:")
		debug(isDebug, request.body)
		// const recaptureResponse = request.body["g-recaptcha-response"] 
		// if (!recaptureResponse) {
		// 	const error = { 
		// 		message: messages.INVALID_CAPTCHA,
		// 	}
		// 	return generateErrorResponse(response, error)
		// }

		// let captchaResponse
		// try {
		// 	captchaResponse = await validateCaptcha(app, recaptureResponse)
		// } catch(e) {
		// 	return generateErrorResponse(response, e)
		// }
		const receiver = request.body.receiver
		const network = request.body.network
		const twitter = request.body.twitter
		const userAmount = request.body.XDCNumber

		// if (await validateCaptchaResponse(captchaResponse, receiver, response)) {
		// 	await sendPOAToRecipient(web3, receiver, response, isDebug)
		// } 
	});
	// app.get('/donate/:address', async function(request, response) {
	// 	let receiver = request.params.address
	// 	const isDebug = app.config.debug
	// 	debug(isDebug, "REQUEST:")
	// 	debug(isDebug, request.body)
	// 	await sendPOAToRecipient(web3, receiver, response, isDebug)
	// });

	app.get('/donate/:address/:network/:amount', async function (request, response) {
		let receiver = request.params.address
		let network = request.params.network
		var userAmount = request.params.amount
		var webnew3 = await validateNetwork(config, network)
		const isDebug = app.config.debug
		debug(isDebug, "REQUEST:")
		debug(isDebug, request.body)
		await sendPOAToRecipient(webnew3, receiver, response, isDebug, userAmount = 1000, twitter = null)
	});

	app.get('/donate/:address/:network/:amount/:twitter', async function (request, response) {
		let receiver = request.params.address
		let network = request.params.network
		let userAmount = request.params.amount
		let twitter = request.params.twitter
		var webnew3 = await validateNetwork(config, network)
		const isDebug = app.config.debug
		debug(isDebug, "REQUEST:")
		debug(isDebug, request.body)
		await sendPOAToRecipient(webnew3, receiver, response, isDebug, userAmount, twitter)

	});



	app.get('/health', async function (request, response) {
		let balanceInWei
		let balanceInEth
		const address = config.Ethereum[config.environment].account
		try {
			balanceInWei = await web3.eth.getBalance(address)
			balanceInEth = await web3.utils.fromWei(balanceInWei, "ether")
		} catch (error) {
			return generateErrorResponse(response, error)
		}

		const resp = {
			address,
			balanceInWei: balanceInWei,
			balanceInEth: Math.round(balanceInEth)
		}
		response.send(resp)
	});

	// async function validateCaptchaResponse(captchaResponse, receiver, response) {
	// 	if (!captchaResponse || !captchaResponse.success) {
	// 		generateErrorResponse(response, {message: messages.INVALID_CAPTCHA})
	// 		return false
	// 	}

	// 	return true
	// }

	async function sendPOAToRecipient(web3, receiver, response, isDebug, userAmount, twitter) {
		let senderPrivateKey = config.Ethereum[config.environment].privateKey
		const privateKeyHex = Buffer.from(senderPrivateKey, 'hex')
		receiver = '0x' + receiver.substring(3)
		if (!web3.utils.isAddress(receiver)) {
			return generateErrorResponse(response, { message: messages.INVALID_ADDRESS })
		}

		const gasPrice = web3.utils.toWei('1', 'gwei')
		const gasPriceHex = web3.utils.toHex(gasPrice)
		const gasLimitHex = web3.utils.toHex(config.Ethereum.gasLimit)
		const nonce = await web3.eth.getTransactionCount(config.Ethereum[config.environment].account)
		const nonceHex = web3.utils.toHex(nonce)


		if (twitter != null) {
			sendMail(receiver, userAmount, twitter)
		}
		var ethToSend = web3.utils.toHex(web3.utils.toWei(userAmount.toString(), 'ether'))


		const rawTx = {
			nonce: nonceHex,
			gasPrice: gasPriceHex,
			gasLimit: gasLimitHex,
			to: receiver,
			value: ethToSend,
			data: '0x00'
		}
		const tx = new EthereumTx(rawTx)
		tx.sign(privateKeyHex)

		const serializedTx = tx.serialize()

		let txHash
		web3.eth.sendSignedTransaction("0x" + serializedTx.toString('hex'))
			.on('transactionHash', (_txHash) => {
				txHash = _txHash
			})
			.on('receipt', (receipt) => {
				debug(isDebug, receipt)
				if (receipt.status == '0x1') {
					return sendRawTransactionResponse(txHash, response, receiver, ethToSend)
				} else {
					const error = {
						message: messages.TX_HAS_BEEN_MINED_WITH_FALSE_STATUS,
					}
					return generateErrorResponse(response, error);
				}
			})
			.on('error', (error) => {
				return generateErrorResponse(response, error)
			});

	}



	function sendRawTransactionResponse(txHash, response, receiver, ethToSend) {
		ethToSend = parseInt(ethToSend, 16)
		const amountToSend = ethToSend / 1000000000000000000
		const successResponse = {
			code: 200,
			title: 'Success',
			address: receiver,
			amount: amountToSend,
			message: messages.TX_HAS_BEEN_MINED,
			txhash: txHash
		}
		const arr=[];
		arr.push(successResponse)
		showhistory(arr)
		response.send({
			success: successResponse
		}) 
	}
	function showhistory(arr){
		 arr.forEach(element => console.log(element));
		// console.log(arr[0])
	}
}


