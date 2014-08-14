var KTouchStatsFile = require("../../src/ktouchstats/KTouchStatsFile");

describe("KTouchStatsFile", function() {
	it("can load a file", function() {
		var stats = new KTouchStatsFile(__dirname + "/statistics.xml");

		expect(stats.getUser()).toBe("Default User");
	});

	it("can get urls of lectures", function() {
		var stats = new KTouchStatsFile(__dirname + "/statistics.xml");
		var urls = stats.getLectureUrls();

		var expectedUrls = [
			'default',
			'file:///usr/share/kde4/apps/ktouch/Lecture/English/en.ktouch.xml',
			'file:///usr/share/kde4/apps/ktouch/Lecture/Norwegian/no.ktouch.xml'
		]

		expect(urls).toEqual(expectedUrls);
	});

	it("can check max level started", function() {
		var stats = new KTouchStatsFile(__dirname + "/statistics.xml");
		var urls = stats.getLectureUrls();

		var lecture;

		lecture = stats.getLectureByUrl(urls[0]);
		expect(lecture.getMaxLevelStarted()).toBe(0);

		lecture = stats.getLectureByUrl(urls[1]);
		expect(lecture.getMaxLevelStarted()).toBe(1);

		lecture = stats.getLectureByUrl(urls[2]);
		expect(lecture.getMaxLevelStarted()).toBe(1);
	});
});