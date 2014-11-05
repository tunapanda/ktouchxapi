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

		mockTinCan.sendStatement = function(statement, cb) {
			expect(statement.actor.mbox).toBe("alice@hello.com");
			expect(statement.actor.name).toBe("Alice User");
			cb([{
				err: null
			}]);
		};

		spyOn(mockTinCan, "getStatements").and.callThrough();
		spyOn(mockTinCan, "sendStatement").and.callThrough();

		var passwd = new Passwd(__dirname + "/etc/passwd");

		var mockApp = {};
		mockApp.getActorDomain = function() {
			return "hello.com";
		}
		mockApp.getDefaultVerbPrefix = function() {
			return "http://example.com/";
		}
		mockApp.getPasswd = function() {
			return passwd;
		}
		mockApp.getFilterFunctions = function() {
			return [];
		}

		var statsFile = new KTouchStatsFile(__dirname + "/../res/statistics.xml");
		var kTouchUser = new KTouchUser("alice", statsFile, mockApp);

		kTouchUser.syncToXApi(mockTinCan).then(
			function() {
				expect(mockTinCan.getStatements).toHaveBeenCalled();
				expect(mockTinCan.sendStatement).toHaveBeenCalled();
				console.log("calls: " + mockTinCan.sendStatement.calls.count());
				done();
			}
		);
	});
});