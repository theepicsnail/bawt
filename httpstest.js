var https = require('https');
var ical = require( 'ical.js' )


var options = {
  hostname: 'www.google.com',
  port: 443,
  path: '/calendar/ical/riflepaperco.com_2832qms2poc8madqd0uumdmdvo%40group.calendar.google.com/public/basic.ics',
  method: 'GET'
};

var peeps = []
var data = ""

var req = https.request(options, function(res) {
	console.log("statusCode: ", res.statusCode)
	console.log("headers: ", res.headers)
	console.log("\n\n\n\n\n\n\n\n\n\n\n")
	res.on('data', function(chunk) {
		data += chunk;
	}).on('end', function(){
		//console.log(data)	
		
		var jcalData = ICAL.parse(data)
		//console.log('///' + jcalData + '///');

		for ( var i = 0; i < jcalData[1][2].length; i++ ) {

			var startDate   = new Date(jcalData[1][2][i][1][0][3])
			var endDate     = new Date(jcalData[1][2][i][1][1][3])
			var today       = new Date("2015-04-24")

			if (startDate <= today && endDate >= today) {

				var summary = jcalData[1][2][i][1][10][3]
				var name = summary.split(' - ')[0]
				peeps.push(name)

			}

		}//*/
	console.log(peeps);
    //process.stdout.write(d);
  });
});
req.end();

req.on('error', function(e) {
  console.error(e);
});
