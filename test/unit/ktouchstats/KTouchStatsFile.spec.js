var KTouchStatsFile = require("../../../src/ktouchstats/KTouchStatsFile");

describe("KTouchStatsFile", function() {
	it("can load a file", function() {
		var stats = new KTouchStatsFile(__dirname + "/../res/statistics.xml");

		expect(stats.getUser()).toBe("Default User");
	});

	it("can get urls of lectures", function() {
		var stats = new KTouchStatsFile(__dirname + "/../res/statistics.xml");
		var urls = stats.getLectureUrls();

		var expectedUrls = [
			'default',
			'file:///usr/share/kde4/apps/ktouch/Lecture/English/en.ktouch.xml',
			'file:///usr/share/kde4/apps/ktouch/Lecture/Norwegian/no.ktouch.xml'
		]

		expect(urls).toEqual(expectedUrls);
	});

	it("can check max level started", function() {
		var stats = new KTouchStatsFile(__dirname + "/../res/statistics.xml");
		var urls = stats.getLectureUrls();

		var lecture;

		lecture = stats.getLectureByUrl(urls[0]);
		expect(lecture.getMaxLevelStarted()).toBe(0);

		lecture = stats.getLectureByUrl(urls[1]);
		expect(lecture.getMaxLevelStarted()).toBe(1);

		lecture = stats.getLectureByUrl(urls[2]);
		expect(lecture.getMaxLevelStarted()).toBe(1);
	});

	it("can get stats for all atempts", function() {
		var stats = new KTouchStatsFile(__dirname + "/../res/statistics.xml");
		var urls = stats.getLectureUrls();
		var lecture;

		lecture = stats.getLectureByUrl(urls[0]);
		expect(lecture.getLevelStats().length).toBe(2);

		expect(lecture.getLevelStats()[0].getDurationTime()).toEqual(68.5);
		expect(lecture.getLevelStats()[1].getDurationTime()).toEqual(58.5);
	});

	it("can get stats for all levels", function() {
		var stats = new KTouchStatsFile(__dirname + "/../res/statistics.xml");

		var levelStats=stats.getLevelStats();

		expect(levelStats.length).toBe(8);
	});
});