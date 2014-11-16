var KTouchStats = require("../../../src/app/KTouchStats");
var UserUtil = require("../../../src/utils/UserUtil");
var FileUtil = require("../../../src/utils/FileUtil");
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

	it("can sync to xapi", function(done) {
		var seenUsers = [];

		var mockTinCan = {};
		mockTinCan.getStatements = function(p) {
			p.callback(null, {
				statements: []
			});
		};

		mockTinCan.sendStatement = function(statement, cb) {
			expect(statement.actor.mbox).not.toBeNull();

			if (seenUsers.indexOf(statement.actor.mbox) < 0)
				seenUsers.push(statement.actor.mbox);

			cb([{
				err: null
			}]);
		};

		spyOn(mockTinCan, "getStatements").and.callThrough();
		spyOn(mockTinCan, "sendStatement").and.callThrough();

		var ktouchstats = new KTouchStats();
		ktouchstats.setBaseHomeDir(__dirname + "/users");
		ktouchstats.setStatisticsFileName("teststats.xml");
		ktouchstats.setTinCan(mockTinCan);
		ktouchstats.setActorDomain("example.com");

		ktouchstats.run().then(
			function() {
				expect(mockTinCan.getStatements.calls.count()).toBe(16);
				expect(mockTinCan.sendStatement.calls.count()).toBe(16);

				expect(seenUsers.length).toBe(2);
				expect(seenUsers.indexOf("bob@example.com")).toBeGreaterThan(-1);
				done();
			},
			function(e) {
				console.log("failed: " + e);
			}
		);
	});

	it("can use a filter function", function(done) {
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

		function filter(statement) {
			if (statement.actor.mbox == "bob@example.com")
				return true;

			else
				return false;
		}

		var ktouchstats = new KTouchStats();
		ktouchstats.addFilterFunction(filter);
		ktouchstats.setBaseHomeDir(__dirname + "/users");
		ktouchstats.setStatisticsFileName("teststats.xml");
		ktouchstats.setTinCan(mockTinCan);
		ktouchstats.setActorDomain("example.com");

		ktouchstats.run().then(
			function() {
				expect(mockTinCan.getStatements.calls.count()).toBe(8);
				expect(mockTinCan.sendStatement.calls.count()).toBe(8);
				done();
			},
			function(e) {
				console.log("failed: " + e);
			}
		);
	});

	it("can get a lecture name by url, if the file exists in the exact location", function() {
		var exactFileUrl = "file://" + __dirname + "/../res/testlecture.xml";

		var ktouchstats = new KTouchStats();
		var lecture = ktouchstats.getLectureByUrl(exactFileUrl);

		expect(lecture.getName()).toBe("The title of the lecture");
	})
});