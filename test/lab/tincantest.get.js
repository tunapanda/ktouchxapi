var TinCan=require("tincanjs");

var tincan=new TinCan({
	recordStores: [{
		endpoint: "http://localhost/repo/learninglocker/public/data/xAPI/",
		username: "b47fc60e6d92b4fa5497b7c38bcb2b98606fa5ae",
		password: "a6485b033734f630f9af5a9ac732ec10db5d92b7",
		allowFail: false
	}]
});

tincan.getStatements({
	params: {
		/*"context": {
			"extensions": {
				"http://tincanapi.com/JsTetris_TCAPI/gameId": "27b7a60d-36a5-41cc-841a-963f23c80e7b"
			}
		}*/

/*		"activity":
			new TinCan.Activity({
				"id": "http://tincanapi.com/JsTetris_TCAPI/level1"
			})*/

		"timestamp": "1975-06-09T12:34:56"
	},
	callback: function(err,result) {
		console.log("got it, e="+err);
		//console.log("statements: "+result.statements.length);
		console.log(result);
	}
});
