var xmldoc = require("xmldoc");

var KTouchLevelStats=require("./KTouchLevelStats");

/**
 * Parse a LectureStats node in a KTouch statistics.xml file.
 * @class KTouchStatsFile
 */
function KTouchLectureStats(node) {
	this.node = node;
	this.levelStats = [];

	var allLevelStats = this.node.childNamed("AllLevelStats").childrenNamed("LevelStats");

	for (i = 0; i < allLevelStats.length; i++) {
		var levelStatistic = new KTouchLevelStats(this, allLevelStats[i]);
		this.levelStats.push(levelStatistic);
	}
}

/**
 * Get statistics for all levels.
 * @method getLevelStats
 */
KTouchLectureStats.prototype.getLevelStats=function() {
	return this.levelStats;
}

/**
 * Get url.
 * @method getUser
 */
KTouchLectureStats.prototype.getUrl = function() {
	return this.node.childNamed("URL").val;
}

/**
 * Get the highest level that the user has started.
 * @method getMaxLevelStarted
 */
KTouchLectureStats.prototype.getMaxLevelStarted = function() {
	var allLevelStats = this.node.childNamed("AllLevelStats").childrenNamed("LevelStats");
	var i;

	var maxNum = 0;

	for (i = 0; i < allLevelStats.length; i++) {
		var levelStats = allLevelStats[i];
		maxNum = Math.max(maxNum, levelStats.attr.Number);
	}

	return maxNum;
}

module.exports = KTouchLectureStats;