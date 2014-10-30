var KTouchStatsFile = require("../../../src/ktouchstats/KTouchStatsFile");
var LevelStatement = require("../../../src/ktouchxapi/LevelStatement");

describe("LevelStatement", function() {
	it("can generate an xapi statement from a ktouch level", function() {
		var statsFile = new KTouchStatsFile(__dirname + "/../res/statistics.xml");

		var url = statsFile.getLectureUrls()[1];
		//console.log("url: " + url);

		var lecture = statsFile.getLectureByUrl(statsFile.getLectureUrls()[1]);
		var levelStats = lecture.getLevelStats()[0];

		var levelStatement=new LevelStatement(levelStats);
		levelStatement.setActorEmail("hello@world.com");
		console.log(levelStatement.getXApiStatement());
	});
});