var request = require('request')
var ical = require( 'ical.js' )
var https = require( 'https' )
 
module.exports = function (req, res, next) {

	var botPayload = {}

	botPayload.text = checkWhosOut()
	botPayload.username = 'calendarbot'
	botPayload.channel = req.body.channel_id
	botPayload.icon_emoji = ':date:'
	console.log("Testing: " + Object.keys(botPayload))


	send(botPayload, function (error, status, body) {
		if (error) {
			return next(error)

		} else if (status !== 200) {
			// inform user that our Incoming WebHook failed
			return next(new Error('Incoming WebHook: ' + status + ' ' + body))

		} else {
			return res.status(200).end()
		}
	});
}
 
function checkWhosOut() {
	
	var peeps = []
	var options = {
		host: 'www.google.com',
		port: 443,
		path: '/calendar/ical/riflepaperco.com_2832qms2poc8madqd0uumdmdvo%40group.calendar.google.com/public/basic.ics',
		method: 'GET'
	}	
	
	
	console.log("+++ " + Object.keys(options));
	var req = https.request(options, function(res) {

		var data = ""
	 	console.log("FUCKING SHIT GODDAMMIT FUCK");	
		res.on('data', function (chunk) {

			data += chunk
			

		}).on('end', function() {

			var jcalData = ICAL.parse(data)

			console.log('///' + jcalData + '///');

			for ( var i = 0; i < jcalData[1][2].length; i++ ) {
				
				var startDate 	= new Date(jcalData[1][2][i][1][0][3])
				var endDate		= new Date(jcalData[1][2][i][1][1][3])
				var today		= new Date("2015-04-24")

				if (startDate <= today && endDate >= today) {
					
					var summary = jcalData[1][2][i][1][10][3]
					var name = summary.split(' - ')[0]
					peeps.push(name)

				}

			}

		})

	})

	console.log("\n=======================" + peeps + "\n=======================\n");

	return peeps

}
 
function send (payload, callback) {
	//var path = process.env.INCOMING_WEBHOOK_PATH;
	var path = '/T03MQBBHJ/B04H9MABW/5HeNoIBgsatXtnchmlkYcoZJ'
	var uri = 'https://hooks.slack.com/services' + path
	request({
		uri: uri,
		method: 'POST',
		body: JSON.stringify(payload)
	}, function (error, response, body) {
		if(error) {
			return callback(error)
		}

		callback(null, response.statusCode, body)
	});
}
