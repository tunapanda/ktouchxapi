var KTouchUser = require("../../../src/app/KTouchUser");
var KTouchStatsFile = require("../../../src/ktouchstats/KTouchStatsFile");

describe("KTouchUser", function() {
	it("can send stats to tincan", function() {
		var statsFile = new KTouchStatsFile(__dirname + "/../res/statistics.xml");
		var kTouchUser = new KTouchUser("micke", statsFile);

		var mockTinCan = {};

		kTouchUser.syncToXApi(mockTinCan);
	});
});