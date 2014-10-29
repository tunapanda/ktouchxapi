var TinCan = require("tincanjs");

var tincan = new TinCan({
	recordStores: [{
		endpoint: "http://localhost/repo/learninglocker/public/data/xAPI/",
		username: "b47fc60e6d92b4fa5497b7c38bcb2b98606fa5ae",
		password: "a6485b033734f630f9af5a9ac732ec10db5d92b7",
		allowFail: false
	}]
});

tincan.voidStatement(
	"a1d9dc04-41a9-4786-9563-65974eb3aa65xx",
	function(err, res) {
		console.log("voided, err=" + err + " res=" + res);
	}, {
		actor: {
			objectType: undefined
		}
	}
);