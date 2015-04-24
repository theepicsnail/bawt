var ical = require( 'ical.js' );
var https = require( 'https' );
var Slack= require( 'node-slack' );

var slack = new Slack("riflepaperco", "xoxb-4576633068-1grqY6hLDU6jjdXdN9ldz8oC");

var options = {
	host: 'www.google.com',
	port: 443,
	path: '/calendar/ical/riflepaperco.com_2832qms2poc8madqd0uumdmdvo%40group.calendar.google.com/public/basic.ics',
	//path: '/calendar/ical/familab.4am%40gmail.com/public/basic.ics',
	method: 'GET'
}

        var req = https.request(options, function(res) {
            var data = ""
            res.on('data', function (chunk) {
                data += chunk
            }).on('end', function() {
				//console.log(" : " + data);
				var jcalData = ICAL.parse(data);
				// Calendar Description
				//console.log(jcalData['1']['1']['6']['3']);
				var i = 21;
				var peeps = [];
				for( var i =0; i< jcalData['1']['2'].length; i++ ) {
					var startDate = new Date(jcalData['1']['2'][i]['1']['0']['3']);
					var endDate = new Date(jcalData['1']['2'][i]['1']['1']['3']);
					var today = new Date("2015-04-20");
					if (startDate <= today && endDate >= today){
						//console.log(startDate < today);
						//console.log("D: " + startDate + " < " + today + " < " + endDate);	
						//console.log(today < endDate);
						//console.log(jcalData['1']['2'][i]['1'] + "\n\n");
						var summary = (jcalData[1][2][i][1][10][3]);
						var name = summary.split(" - ")[0];
						peeps.push(name);
					}
				}
				console.log( peeps );
				slack.send({
					text: 'Howdy!',
					channel: '#techsupport',
					username: 'Beebot'
				});
            })
    })
    req.end()
