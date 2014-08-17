var KTouchStats = require("../../src/app/KTouchStats");
var UserUtil = require("../../src/utils/UserUtil");
var FileUtil = require("../../src/utils/FileUtil");
var fs = require("fs");

describe("KTouchStats", function() {
	it("can generate a csv file", function(done) {
		if (FileUtil.existsSync(__dirname + "/out.csv"))
			fs.unlinkSync(__dirname + "/out.csv");

		var ktouchstats = new KTouchStats();
		ktouchstats.setBaseHomeDir(__dirname + "/users");
		ktouchstats.setStatisticsFileName("teststats.xml");
		ktouchstats.setCsvOutputFileName(__dirname + "/out.csv");

		ktouchstats.run().then(
			function() {
				var expectedData =
					"User," +
					"default," +
					"file:///usr/share/kde4/apps/ktouch/Lecture/English/en.ktouch.xml," +
					"file:///usr/share/kde4/apps/ktouch/Lecture/Norwegian/no.ktouch.xml," +
					"file:///usr/share/kde4/apps/ktouch/Lecture/English/en.ktouch.something.else.xml\n" +
					"alice,0,1,1,0\n" +
					"bob,0,0,1,1\n"

				var data = fs.readFileSync(__dirname + "/out.csv").toString();

				expect(data).toBe(expectedData);

				if (data == expectedData)
					fs.unlinkSync(__dirname + "/out.csv");

				done();
			});
	});
});