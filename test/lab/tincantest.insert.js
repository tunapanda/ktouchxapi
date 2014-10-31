var TinCan = require("tincanjs");

var tincan = new TinCan({
	recordStores: [{
		endpoint: "http://localhost/repo/learninglocker/public/data/xAPI/",
		username: "b47fc60e6d92b4fa5497b7c38bcb2b98606fa5ae",
		password: "a6485b033734f630f9af5a9ac732ec10db5d92b7",
		allowFail: false
	}]
});

tincan.sendStatement({
	timestamp: "2014-10-28T12:34:56",
//  timestamp: "hello world",
	actor: {
		mbox: "mailto:li.mikael@gmail.com"
	},
	verb: {
		id: "http://adlnet.gov/expapi/verbs/attempted"
	},
	target: {
		id: "http://tunapanda.org/ktouch/1"
	}
}, function(a, b) {
	console.log("here, a="+a+", b="+b);
	console.log(a);
});