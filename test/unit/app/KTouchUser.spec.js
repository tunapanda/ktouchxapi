var KTouchUser = require("../../../src/app/KTouchUser");
var KTouchStatsFile = require("../../../src/ktouchstats/KTouchStatsFile");
var Passwd = require("../../../src/utils/Passwd");

describe("KTouchUser", function() {
	it("can send stats to tincan", function(done) {
		var mockTinCan = {};
		mockTinCan.getStatements = function(p) {
			p.callback(null, {
				statements: []
			});
		};

		mockTinCan.getStatement = function(id, cb) {
			cb(null, []);
		}

		mockTinCan.sendStatement = function(statement, cb) {
			expect(statement.actor.mbox).toBe("alice@hello.com");
			expect(statement.actor.name).toBe("Alice User");
			cb([{
				err: null
			}]);
		};

		spyOn(mockTinCan, "getStatements").and.callThrough();
		spyOn(mockTinCan, "getStatement").and.callThrough();
		spyOn(mockTinCan, "sendStatement").and.callThrough();

		var passwd = new Passwd(__dirname + "/etc/passwd");

		var mockApp = {};
		mockApp.getActorDomain = function() {
			return "hello.com";
		}
		mockApp.getTargetPrefix = function() {
			return "http://example.com/";
		}
		mockApp.getUseFullTargetPath = function() {
			return false;
		}
		mockApp.getPasswd = function() {
			return passwd;
		}
		mockApp.getFilterFunctions = function() {
			return [];
		}
		mockApp.getCompletionPercentage = function() {
			return 98;
		}
		mockApp.getCompletionChars = function() {
			return 300;
		}
		mockApp.getLectureByUrl = function() {
			return null;
		}

		var statsFile = new KTouchStatsFile(__dirname + "/../res/statistics.xml");
		var kTouchUser = new KTouchUser("alice", statsFile, mockApp);

		kTouchUser.syncToXApi(mockTinCan).then(
			function() {
				expect(mockTinCan.getStatement).toHaveBeenCalled();
				//expect(mockTinCan.getStatements).toHaveBeenCalled();
				expect(mockTinCan.sendStatement).toHaveBeenCalled();
				console.log("calls: " + mockTinCan.sendStatement.calls.count());
				done();
			}
		);
	});
});