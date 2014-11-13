/**
 * Contains information for one level attempt.
 * @class KTouchLevelStats
 */
function KTouchLevelStats(lecture, data) {
	this.lecture = lecture;
	this.data = data;
}

/**
 * Get level number.
 * @method getNumber
 */
KTouchLevelStats.prototype.getNumber = function() {
	return parseInt(this.data.attr.Number);
}

/**
 * Get duration.
 * @method getDurationTime
 */
KTouchLevelStats.prototype.getDurationTime = function() {
	return parseFloat(this.data.attr.Time);
}

/**
 * Get timestamp.
 * @method getTimestamp
 */
KTouchLevelStats.prototype.getTimestamp = function() {
	return this.data.childNamed("Time").val;
}

/**
 * Return parent lecture.
 * @method getLecture
 */
KTouchLevelStats.prototype.getLecture = function() {
	return this.lecture;
}

/**
 * Get corrects.
 * @method getCorrects
 */
KTouchLevelStats.prototype.getCorrects = function() {
	return parseInt(this.data.attr.Corrects);
}

/**
 * Get chars.
 * @method getChars
 */
KTouchLevelStats.prototype.getChars = function() {
	return parseInt(this.data.attr.Chars);
}

module.exports = KTouchLevelStats;