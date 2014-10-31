var TinCan = require("tincanjs");

var tincan = new TinCan({
	recordStores: [{
		endpoint: "http://localhost/repo/learninglocker/public/data/xAPI/",
		username: "b47fc60e6d92b4fa5497b7c38bcb2b98606fa5ae",
		password: "a6485b033734f630f9af5a9ac732ec10db5d92b7",
		allowFail: false
	}]
});

tincan.getStatements({
	params: {
		"agent": new TinCan.Agent({
			"mbox": "mailto:li.mikael@gmail.com"
		}),

		"activity": new TinCan.Activity({
			"id": "http://tincanapi.com/JsTetris_TCAPI"
		})
	},
	callback: function(err, result) {
		console.log("got it, e=" + err);
		console.log("statements: " + result.statements.length);
		//console.log(result);
	}
});