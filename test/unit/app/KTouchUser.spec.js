var KTouchUser = require("../../../src/app/KTouchUser");
var KTouchStatsFile = require("../../../src/ktouchstats/KTouchStatsFile");

describe("KTouchUser", function() {
	it("can send stats to tincan", function() {
		var statsFile = new KTouchStatsFile(__dirname + "/../res/statistics.xml");
		var kTouchUser = new KTouchUser("micke", statsFile);
		kTouchUser.setActorDomain("hello.com");

		var mockTinCan = {};
		mockTinCan.getStatements=function() {

		};

		mockTinCan.sendStatement=function() {

		};

		spyOn(mockTinCan,"getStatements").and.callThrough();
		spyOn(mockTinCan,"sendStatement").and.callThrough();

		kTouchUser.syncToXApi(mockTinCan);

		expect(mockTinCan.getStatements).toHaveBeenCalled();
		//expect(mockTinCan.sendStatement).toHaveBeenCalled();
	});
});