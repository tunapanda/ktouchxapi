var xmldoc = require("xmldoc");
var fs = require("fs");
var KTouchStatsLecture = require("./KTouchStatsLecture");

/**
 * Parse a KTouch statistics.xml file.
 * @class KTouchStatsFile
 */
function KTouchStatsFile(url) {
	var contents = fs.readFileSync(url);
	var i;

	this.doc = new xmldoc.XmlDocument(contents);
	this.lectureUrls = [];
	this.lectureByUrl = {};

	var lectureNodes = this.doc.childNamed("KTouchStatistics").childrenNamed("LectureStats");

	for (var i = 0; i < lectureNodes.length; i++) {
		var lecture = new KTouchStatsLecture(lectureNodes[i]);

		this.lectureUrls.push(lecture.getUrl());
		this.lectureByUrl[lecture.getUrl()] = lecture;
	}
}

/**
 * Get user.
 * @method getUser
 */
KTouchStatsFile.prototype.getUser = function() {
	return this.doc.descendantWithPath("KTouchStatistics.User").val;
}

/**
 * Get urls of all lectures that we have stats for.
 * @method getLectureUrls
 */
KTouchStatsFile.prototype.getLectureUrls = function() {
	return this.lectureUrls;
}

/**
 * Get lecture stats for a specific url.
 * @method getLectureByUrl
 */
KTouchStatsFile.prototype.getLectureByUrl = function(url) {
	return this.lectureByUrl[url];
}

module.exports = KTouchStatsFile;