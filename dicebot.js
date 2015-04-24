var request = require('request');
 
module.exports = function (req, res, next) {

	var matches;
	var times = 1;
	var die = 6;
	var rolls = [];
	var total = 0;
	var botPayload = {};

	if (req.body.text) {
		// Parse roll
		matches = req.body.text.match(/^(\d{1,2})d(\d{1,2})$/);


		if (matches && matches[1] && matches[2]) {
			times = matches[1];
			dies = matches[2];
		} else {
			// Send error
			return res.status(200).send('<number>d<sides>');
		}
	}
	for (var i = 0; i < times; i++) {
		var currentRoll = roll(1, die);
		rolls.push(currentRoll);
		total += currentRoll;
	}


	botPayload.text = req.body.user_name + ' rolled ' + times + 'd' + die + ':\n' +
	                          rolls.join(' + ') + ' = *' + total + '*';
	botPayload.username = 'dicebot';
	botPayload.channel = req.body.channel_id;
	botPayload.icon_emoji = ':game_die:';
	console.log("Testing: " + Object.keys(botPayload));


	send(botPayload, function (error, status, body) {
		if (error) {
			return next(error);

		} else if (status !== 200) {
			// inform user that our Incoming WebHook failed
			return next(new Error('Incoming WebHook: ' + status + ' ' + body));

		} else {
			return res.status(200).end();
		}
	});
};
 
function roll (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
 
function send (payload, callback) {
	//var path = process.env.INCOMING_WEBHOOK_PATH;
	var path = '/T03MQBBHJ/B04H9MABW/5HeNoIBgsatXtnchmlkYcoZJ';
	var uri = 'https://hooks.slack.com/services' + path;
	console.log("TEST: " + uri);	
	request({
		uri: uri,
		method: 'POST',
		body: JSON.stringify(payload)
	}, function (error, response, body) {
		if(error) {
			return callback(error);
		}

		callback(null, response.statusCode, body);
	});
}
