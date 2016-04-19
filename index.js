var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// to post data
app.post('/webhook/', function (req, res) {
	messaging_events = req.body.entry[0].messaging
	for (i = 0; i < messaging_events.length; i++) {
		event = req.body.entry[0].messaging[i]
		sender = event.sender.id
		if (event.message && event.message.text) {
			text = event.message.text
			if (text === 'Generic') {
				sendGenericMessage(sender)
				continue
			}
			if(text === 'Mia Khalifa' ){
				sendMiaKhalifa(sender)
				continue
			}
			if(text === 'Bc'){
				sendTextMessage(sender,"Gali kisko de raha bhosdike")
			}
			sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		}
		if (event.postback) {
			text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	}
	res.sendStatus(200)
})

var token = "CAAHvyqgTUiUBAEssZBUect3CuqMV3IzULbakdAv04ISt2Gk9wqIZChaIEqaMguADh88PK7AG3w1odSr3I4liXoVSUKO0h4Assl6h8zjhvPKZAaPPfL4oHl9HZAdsaXmHoi4ziutjnIXv8oLnlM8R9dT5HwTppjk9fqzJVyquAtzZCkmVVDaRM2xXtYyiPZBZCWVly1GMHKoygZDZD"

function sendTextMessage(sender, text) {
	messageData = {
		text:text
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericMessage(sender) {
	messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

// Mia Khalifa
function sendMiaKhalifa(sender) {
	messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "Mia Khalifa",
					"subtitle": "Muthiye marega?",
					"image_url": "http://www.pmnupdates.com/wp-content/uploads/2015/09/Mia-khalifa.jpg",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "Khada hua?"
					}, {
						"type": "postback",
						"title": "Nai? Scroll kar aur hai",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Shhhhhhh",
					"subtitle": "Chup chat hila k soja",
					"image_url": "https://usatthebiglead.files.wordpress.com/2015/07/ms6ieiewzdorh8sygrbx.jpg",
					"buttons": [{
						"type": "postback",
						"title": "Wanna fuck me?",
						"payload": "Ain't yout local slut, my heels higher than your standards",
					}],
				}]
			}
		}
	}

}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
