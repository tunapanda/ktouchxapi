var xmldoc = require("xmldoc");
var fs = require("fs");
var url = require("url");
var KTouchLevel = require("./KTouchLevel");
/**
 * Parse a KTouch lecture xml file.
 * @class KTouchLecture
 */
function KTouchLecture(fn) {
	var parsedUrl = url.parse(fn);

	if (parsedUrl.protocol == "file:")
		fn = parsedUrl.path;

	var contents = fs.readFileSync(fn).toString();

	this.doc = new xmldoc.XmlDocument(contents);

	if (this.doc.name != "KTouchLecture")
		throw new Error("This is not a lecture file: " + fn);

	this.title = this.doc.childNamed("Title").val;
	this.levels = [];

	var levelNodes = [];

	if (this.doc.childNamed("Levels"))
		levelNodes = this.doc.childNamed("Levels").childrenNamed("Level")

	else
		levelNodes = this.doc.childrenNamed("Level");

	for (var i = 0; i < levelNodes.length; i++)
		this.levels.push(new KTouchLevel(levelNodes[i]));
}

/**
 * Get title.
 * @method getTitle
 */
KTouchLecture.prototype.getTitle = function() {
	return this.title;
}

/**
 * Get number of levels.
 * @method getNumLevels
 */
KTouchLecture.prototype.getNumLevels = function() {
	return this.levels.length;
}

/**
 * Get level by num.
 * @method getLevelByNum
 */
KTouchLecture.prototype.getLevelByNum = function(num) {
	if (num >= this.levels.length)
		throw new Error("The lecture doesn't have that many levels");

	return this.levels[num];
}

module.exports = KTouchLecture;
