var KTouchUser = require("../../../src/app/KTouchUser");
var KTouchStatsFile = require("../../../src/ktouchstats/KTouchStatsFile");

describe("KTouchUser", function() {
	it("can send stats to tincan", function(done) {
		var mockTinCan = {};
		mockTinCan.getStatements = function(p) {
			p.callback(null, {
				statements: []
			});
		};

		mockTinCan.sendStatement = function(statement, cb) {
			expect(statement.actor.mbox).toBe("micke@hello.com");
			cb([{
				err: null
			}]);
		};

		spyOn(mockTinCan, "getStatements").and.callThrough();
		spyOn(mockTinCan, "sendStatement").and.callThrough();

		var mockApp = {};
		mockApp.getActorDomain = function() {
			return "hello.com";
		}
		mockApp.getDefaultVerbPrefix = function() {
			return "http://example.com/";
		}

		var statsFile = new KTouchStatsFile(__dirname + "/../res/statistics.xml");
		var kTouchUser = new KTouchUser("micke", statsFile, mockApp);

		kTouchUser.syncToXApi(mockTinCan).then(
			function() {
				done();
			}
		);

		expect(mockTinCan.getStatements).toHaveBeenCalled();
		expect(mockTinCan.sendStatement).toHaveBeenCalled();
	});
});