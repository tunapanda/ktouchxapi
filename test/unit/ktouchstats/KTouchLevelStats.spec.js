var KTouchStatsFile = require("../../../src/ktouchstats/KTouchStatsFile");

describe("KTouchLevelStats", function() {
	it("holds info about a completed level", function() {
		var stats = new KTouchStatsFile(__dirname + "/../res/statistics.xml");
		var levelStats = stats.getLevelStats();
		var i;

		expect(levelStats.length).toBe(8);

		for (i = 0; i < levelStats.length; i++) {
			var levelStat = levelStats[i];

			//console.log(levelStat.getLecture().getUrl());
			//console.log(levelStat.getNumber());
		}

		expect(levelStats[0].getDurationTime()).toEqual(68.5);
		expect(levelStats[0].getCorrects()).toEqual(222);
		expect(levelStats[0].getChars()).toEqual(225);
	});
});