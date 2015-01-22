var Thenable = require("../utils/Thenable");
var TinCan = require("tincanjs");
var TinCanSync = require("../utils/TinCanSync");
var url = require("url");

/**
 * Manage a xAPI statement corresponding to a ktouch level.
 * @class LevelStatement
 */
function LevelStatement(levelStats, kTouchUser) {
	if (!kTouchUser)
		throw new Error("Creating level statement without user!");

	this.levelStats = levelStats;
	this.kTouchUser = kTouchUser;
	this.syncThenable = null;
}

/**
 * Get corresponding xapi statement.
 * @method getXApiStatement
 */
LevelStatement.prototype.getXApiStatement = function() {
	if (!this.kTouchUser)
		throw new Error("no user!");

	var verbId = "http://adlnet.gov/expapi/verbs/" + this.getCompletionState();

	var statement = {
		timestamp: this.levelStats.getTimestamp(),
		actor: {
			mbox: this.kTouchUser.getActorEmail()
		},
		verb: {
			id: verbId
		},
		target: {
			id: this.getTargetUrl(),
			definition: {
				name: this.getTargetName()
			}
		},
		result: {
			completion: this.isComplete(),
			success: this.isComplete(),
			score: {
				raw: this.getScore()
			}
		}
	};

	if (this.kTouchUser.getFullName())
		statement.actor.name = this.kTouchUser.getFullName();

	return statement;
}

/**
 * Get target name.
 * @method getTargetName
 */
LevelStatement.prototype.getTargetName = function() {
	var targetUrl = this.levelStats.getLecture().getUrl();
	var lecture = this.kTouchUser.getApp().getLectureByUrl(targetUrl);

	if (lecture)
		return lecture.getTitle();

	return null;
}

/**
 * Get target url.
 * @method getTargetUrl
 */
LevelStatement.prototype.getTargetUrl = function() {
	var targetUrl = this.levelStats.getLecture().getUrl();
	var parsedUrl = url.parse(targetUrl);
	var path = parsedUrl.path;

	if (!this.kTouchUser.getApp().getUseFullTargetPath()) {
		if (path.lastIndexOf("/") >= 0)
			path = path.substr(path.lastIndexOf("/") + 1);
	}

	if (path.substr(0, 1) == "/")
		path = path.substr(1);

	reportUrl = this.kTouchUser.getApp().getTargetPrefix() + path;

	return reportUrl + "#" + this.levelStats.getNumber();
}

/**
 * Check if exists, if not, insert.
 * @method sync
 */
LevelStatement.prototype.sync = function(tinCan) {
	if (this.syncThenable)
		throw new Error("Sync already in progress!");

	var statement = this.getXApiStatement();
	var filterFuntions = this.kTouchUser.getApp().getFilterFunctions();

	for (var i = 0; i < filterFuntions.length; i++) {
		if (!filterFuntions[i](statement)) {
			var thenable = new Thenable();
			thenable.resolve();
			return thenable;
		}
	}

	this.syncThenable = new Thenable();

	var tinCanSync = new TinCanSync(tinCan);
	tinCanSync.syncStatement(statement).then(
		this.ontinCanSyncComplete.bind(this),
		this.ontinCanSyncError.bind(this)
	);

	/*	var thenable = tinCanSync.syncStatement(statement)

		return thenable;*/

	return this.syncThenable;
}

/**
 * Sync complete.
 */
LevelStatement.prototype.ontinCanSyncComplete=function() {
	this.syncThenable.resolve();
}

/**
 * Sync error.
 */
LevelStatement.prototype.ontinCanSyncError=function(e) {
	this.syncThenable.reject(e);
}

/**
 * Get correctness percentage.
 * @method getCorrectPercentage
 */
LevelStatement.prototype.getCorrectPercentage = function() {
	return 100 * this.levelStats.getCorrects() / this.levelStats.getChars();
}

/**
 * Returns:
 * - "completed" if the lecture file can be found, and the level is completed.
 * - "attempted" if the lecture file can be found, but the level is not completed.
 * - "experienced" if the lecture file cannot be found.
 */
LevelStatement.prototype.getCompletionState = function() {
	var targetUrl = this.levelStats.getLecture().getUrl();
	var lecture, level;

	lecture = this.kTouchUser.getApp().getLectureByUrl(targetUrl);
	if (!lecture)
		return "experienced";

	level = lecture.getLevelByNum(this.levelStats.getNumber())
	if (!level)
		return "experienced";

	if (this.levelStats.getChars() < level.getNumChars())
		return "attempted";

	if (this.getCorrectPercentage() < this.kTouchUser.getApp().getCompletionPercentage())
		return "attempted";

	return "completed";
}

/**
 * Is this complete?
 * @method isComplete
 */
LevelStatement.prototype.isComplete = function() {
	var state = this.getCompletionState();

	if (state == "completed")
		return true;

	return false;
}

/**
 * Get score. This is chars per minute.
 * @method getScore
 */
LevelStatement.prototype.getScore = function() {
	if (!this.isComplete())
		return 0;

	return Math.round(60 * this.levelStats.getChars() / this.levelStats.getDurationTime());
}

module.exports = LevelStatement;