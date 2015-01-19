var KTouchLecture = require("../../../src/ktouchstats/KTouchLecture");

describe("KTouchLecture", function() {
	it("can load a KTouch lecture", function() {
		kTouchLecture = new KTouchLecture(__dirname + "/../res/testlecture.xml");

		expect(kTouchLecture.getTitle()).toBe("The title of the lecture");
	});

	it("can load a KTouch lecture from a file url", function() {
		kTouchLecture = new KTouchLecture("file://" + __dirname + "/../res/testlecture.xml");

		expect(kTouchLecture.getTitle()).toBe("The title of the lecture");
	});

	it("can get the number of levels", function() {
		kTouchLecture = new KTouchLecture(__dirname + "/../res/testlecture.xml");

		expect(kTouchLecture.getNumLevels()).toBe(2);
	});

	it("can get a level", function() {
		kTouchLecture = new KTouchLecture(__dirname + "/../res/testlecture.xml");

		expect(kTouchLecture.getLevelByNum(0).getComment()).toBe("A comment for the level");
		expect(kTouchLecture.getLevelByNum(1).getComment()).toBe("A comment for the other level");
	});

	it("can get a number of chars for a level", function() {
		kTouchLecture = new KTouchLecture(__dirname + "/../res/testlecture.xml");

		expect(kTouchLecture.getLevelByNum(0).getNumChars()).toBe(128);
		expect(kTouchLecture.getLevelByNum(1).getNumChars()).toBe(76);
	});

});