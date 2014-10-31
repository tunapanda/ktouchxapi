var KTouchUser = require("../../../src/app/KTouchUser");
var KTouchStatsFile = require("../../../src/ktouchstats/KTouchStatsFile");

describe("KTouchUser", function() {
	it("can send stats to tincan", function(done) {
		var statsFile = new KTouchStatsFile(__dirname + "/../res/statistics.xml");
		var kTouchUser = new KTouchUser("micke", statsFile);
		kTouchUser.setActorDomain("hello.com");

		var mockTinCan = {};
		mockTinCan.getStatements = function(p) {
			p.callback(null, {
				statements: []
			});
		};

		mockTinCan.sendStatement = function(statement, cb) {
			cb([{
				err: null
			}]);
		};

		spyOn(mockTinCan, "getStatements").and.callThrough();
		spyOn(mockTinCan, "sendStatement").and.callThrough();

		kTouchUser.syncToXApi(mockTinCan).then(
			function() {
				done();
			}
		);

		expect(mockTinCan.getStatements).toHaveBeenCalled();
		expect(mockTinCan.sendStatement).toHaveBeenCalled();
	});
});