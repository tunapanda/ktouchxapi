var Passwd = require("../../../src/utils/Passwd");

describe("Passwd", function() {
	it("can parse a passwd file", function() {
		var passwd = new Passwd(__dirname + "/res/passwd");
		var record = passwd.getRecordByUsername("micke");

		expect(record[4]).toBe("Mikael Lindqvist,,,");

		//console.log("record")
		//console.log(record);

		expect(passwd.getFullNameByUserName("micke")).toBe("Mikael Lindqvist");
	});
});