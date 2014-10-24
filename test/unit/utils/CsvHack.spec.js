var CsvHack = require("../../../src/utils/CsvHack");

describe("CsvHack", function() {
	it("can check if a field needs escaping", function() {
		expect(CsvHack.needsEscaping("hello")).toBe(false);
		expect(CsvHack.needsEscaping("hello\nworld")).toBe(true);
		expect(CsvHack.needsEscaping('hello "nice" to meet you')).toBe(true);
	});

	it("can escape a field if needed", function() {
		expect(CsvHack.escapeField("hello")).toBe('"hello"');

		expect(CsvHack.escapeIfNeeded("hello")).toBe("hello");
		expect(CsvHack.escapeIfNeeded("hello, world")).toBe('"hello, world"');
		expect(CsvHack.escapeIfNeeded('testing "hello", world')).toBe('"testing ""hello"", world"');
	});

	it("can stringify data", function() {
		var data = [
			[1, 2, 3],
			["hello", "world"]
		];

		var expected = "1,2,3\nhello,world\n";

		expect(CsvHack.stringify(data)).toEqual(expected);
	})
})