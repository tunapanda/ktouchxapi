var KTouchStatsFile = require("../../../src/ktouchstats/KTouchStatsFile");
var LevelStatement = require("../../../src/ktouchxapi/LevelStatement");

describe("LevelStatement", function() {
	var mockKTouchUser;
	var mockApp;

	beforeEach(function() {
		mockApp = {};
		mockApp.getDefaultVerbPrefix = function() {
			return "http://www.ktouch.org/";
		}

		mockApp.getCompletionPercentage = function() {
			return 98;
		}

		mockApp.getCompletionChars = function() {
			return 300;
		}

		mockKTouchUser = {};
		mockKTouchUser.getActorEmail = function() {
			return "hello@world.com";
		}

		mockKTouchUser.getApp = function() {
			return mockApp;
		}

		mockKTouchUser.getFullName = function() {
			return "Hello World";
		}
	});

	it("can generate an xapi statement from a ktouch level", function() {
		var statsFile = new KTouchStatsFile(__dirname + "/../res/statistics.xml");

		var url = statsFile.getLectureUrls()[1];
		//console.log("url: " + url);

		var lecture = statsFile.getLectureByUrl(statsFile.getLectureUrls()[1]);
		var levelStats = lecture.getLevelStats()[0];

		var levelStatement = new LevelStatement(levelStats, mockKTouchUser);
		//console.log(levelStatement.getXApiStatement());

		for (var i = 0; i < statsFile.getLevelStats().length; i++) {
			var levelStats = statsFile.getLevelStats()[i];
			var levelStatement = new LevelStatement(levelStats, mockKTouchUser);

			console.log("url: " + levelStatement.getTargetUrl());
		}

		//level.getXApiStatement();
	});

	it("can check completion", function() {
		var statsFile = new KTouchStatsFile(__dirname + "/../res/statistics.xml");
		var levelStatement;

		levelStatement = new LevelStatement(statsFile.getLevelStats()[2], mockKTouchUser);
		expect(levelStatement.getCorrectPercentage()).toBe(100);
		expect(levelStatement.isComplete()).toBe(true);
		expect(levelStatement.getScore()).toBe(225);

		var xApiStatement = levelStatement.getXApiStatement();
		expect(xApiStatement.result.score.raw).toBe(225);

		levelStatement = new LevelStatement(statsFile.getLevelStats()[3], mockKTouchUser);
		expect(levelStatement.getCorrectPercentage()).toBeLessThan(100);
		expect(levelStatement.getCorrectPercentage()).toBeGreaterThan(95);
		expect(levelStatement.isComplete()).toBe(false);

		//console.log("score: "+levelStatement.getScore())
		//level.getXApiStatement();
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

		var levelStatement = new LevelStatement(mockStats, mockKTouchUser);

		console.log("url: " + levelStatement.getTargetUrl());
		expect(levelStatement.getTargetUrl()).toBe("http://www.ktouch.org/default#1");

		mockLecture.getUrl = function() {
			return "http://hello.com/world";
		}

		console.log("url: " + levelStatement.getTargetUrl());
		expect(levelStatement.getTargetUrl()).toBe("http://hello.com/world#1");
	});

	it("can have a filter do decide if the statement should be inserted", function(done) {
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

		mockStats.getTimestamp = function() {
			return "1234";
		}

		mockStats.getCorrects = function() {
			return 100;
		}

		mockStats.getChars = function() {
			return 100;
		}

		var levelStatement = new LevelStatement(mockStats, mockKTouchUser);

		var mockTinCan = {};
		mockTinCan.sendStatement = function(statement, cb) {
			cb([{
				err: null
			}]);
		};

		spyOn(mockTinCan, "sendStatement").and.callThrough();

		function filter(statement) {
			return false;
		};

		mockApp.getFilterFunctions = function() {
			return [filter];
		}

		levelStatement.sync(mockTinCan).then(function() {
			expect(mockTinCan.sendStatement.calls.count()).toBe(0);
			done();
		});
	});
});