var xmldoc = require("xmldoc");
var fs = require("fs");
var KTouchLectureStats = require("./KTouchLectureStats");

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
	this.lectures = [];

	var lectureNodes = this.doc.childNamed("KTouchStatistics").childrenNamed("LectureStats");

	for (var i = 0; i < lectureNodes.length; i++) {
		var lecture = new KTouchLectureStats(lectureNodes[i]);

		this.lectureUrls.push(lecture.getUrl());
		this.lectureByUrl[lecture.getUrl()] = lecture;
		this.lectures.push(lecture);
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

/**
 * Get lectures.
 * @method getLecures
 */
KTouchStatsFile.prototype.getLectures = function() {
	return this.lectures;
}

/**
 * Get all level stats.
 * @method getLevelStats
 */
KTouchStatsFile.prototype.getLevelStats = function() {
	var levelStats = [];
	var i, j;

	for (i = 0; i < this.lectures.length; i++) {
		var lecture = this.lectures[i];

		//console.log("proc lect...");

		for (j = 0; j < lecture.getLevelStats().length; j++)
			levelStats.push(lecture.getLevelStats()[j]);
	}

	return levelStats;
}

module.exports = KTouchStatsFile;