var KTouchStatsFile = require("../../src/ktouchstats/KTouchStatsFile");
var LevelStatement = require("../../src/ktouchxapi/LevelStatement");
var TinCan = require("tincanjs");

var tinCan = new TinCan({
	recordStores: [{
		endpoint: "http://localhost/repo/learninglocker/public/data/xAPI/",
		username: "b47fc60e6d92b4fa5497b7c38bcb2b98606fa5ae",
		password: "a6485b033734f630f9af5a9ac732ec10db5d92b7",
		allowFail: false
	}]
});

var statsFile = new KTouchStatsFile(__dirname + "/statistics.xml");
var levelStats = statsFile.getLevelStats()[2];
var levelStatement = new LevelStatement(levelStats, "li.mikael@gmail.com");

console.log("syncing: "+levelStatement.getTargetUrl());

levelStatement.sync(tinCan).then(
	function() {
		console.log("success!")
	},
	function(err) {
		console.log("fail");
		console.log(err);
	}
);