var KTouchStatsFile = require("../../../src/ktouchstats/KTouchStatsFile");
var LevelStatement = require("../../../src/ktouchxapi/LevelStatement");

describe("LevelStatement", function() {
	it("can generate an xapi statement from a ktouch level", function() {
		var statsFile = new KTouchStatsFile(__dirname + "/../res/statistics.xml");

		var url = statsFile.getLectureUrls()[1];
		//console.log("url: " + url);

		var lecture = statsFile.getLectureByUrl(statsFile.getLectureUrls()[1]);
		var levelStats = lecture.getLevelStats()[0];

		var levelStatement = new LevelStatement(levelStats);
		levelStatement.setActorEmail("hello@world.com");
		//console.log(levelStatement.getXApiStatement());
	});

	it("can generate a proper url if the lecture doesn't have one", function() {
		var mockLecture = {};
		mockLecture.getUrl = function() {
			return "default";
		};

		var mockStats = {};
		mockStats.getLecture = function() {
			return mockLecture;
		}

		mockStats.getNumber = function() {
			return 1;
		}

		var levelStatement = new LevelStatement(mockStats);
		levelStatement.setDefaultVerbPrefix("http://www.ktouch.org/")

		console.log("url: " + levelStatement.getTargetUrl());
		expect(levelStatement.getTargetUrl()).toBe("http://www.ktouch.org/default#1");

		mockLecture.getUrl = function() {
			return "http://hello.com/world";
		}

		console.log("url: " + levelStatement.getTargetUrl());
		expect(levelStatement.getTargetUrl()).toBe("http://hello.com/world#1");
	});
});