var TinCan = require("tincanjs");

var tincan = new TinCan({
	recordStores: [{
		endpoint: "http://staging.tunapanda.org/learninglocker/public/data/xAPI/",
		username: "9088f1e9f7c149e72fc76553d5c3c12cfaa5c22c",
		password: "74b2a7150e840ff9f2b7c4fd2617edaa1f6ab770",
		allowFail: false
	}]
});

tincan.sendStatement({
	timestamp: "2014-10-28T12:34:56",
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