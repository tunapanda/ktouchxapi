var TinCan = require("tincanjs");
var aguid = require('aguid');

var tincan = new TinCan({
	recordStores: [{
		endpoint: "http://localhost/repo/learninglocker/public/data/xAPI/",
		username: "7b880fc1f371715ce24309b90e051fcd24d700c3",
		password: "c089ce76ca667862e615995b909f2ddf9acc1795",
		allowFail: false
	}]
});

var id=aguid("hello world");

tincan.sendStatement({
	id: id,
	timestamp: "2014-08-13T10:46:56.000Z",
	actor: {
		mbox: "mailto:li.mikael@gmail.com",
		name: "Some Random Dude"
	},
	verb: {
		id: "http://adlnet.gov/expapi/verbs/completed"
	},
	target: {
		id: "http://tunapanda.org/ktouch/2"
	}
}, function(a, b) {
	console.log("here, a="+a+", b="+b);
	console.log(a);
});