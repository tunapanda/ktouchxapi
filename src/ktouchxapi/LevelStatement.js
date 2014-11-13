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
}

/**
 * Get corresponding xapi statement.
 * @method getXApiStatement
 */
LevelStatement.prototype.getXApiStatement = function() {
	if (!this.kTouchUser)
		throw new Error("no user!");

	var verbId;

	if (this.isComplete())
		verbId = "http://adlnet.gov/expapi/verbs/completed"

	else
		verbId = "http://adlnet.gov/expapi/verbs/attempted"

	var statement = {
		timestamp: this.levelStats.getTimestamp(),
		actor: {
			mbox: this.kTouchUser.getActorEmail()
		},
		verb: {
			id: verbId
		},
		target: {
			id: this.getTargetUrl()
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
 * Get target url.
 * @method getTargetUrl
 */
LevelStatement.prototype.getTargetUrl = function() {
	var targetUrl = this.levelStats.getLecture().getUrl();
	var parsedUrl = url.parse(targetUrl);

	if (!parsedUrl.protocol)
		targetUrl = this.kTouchUser.getApp().getDefaultVerbPrefix() + targetUrl;

	return targetUrl + "#" + this.levelStats.getNumber();
}

/**
 * Check if exists, if not, insert.
 * @method sync
 */
LevelStatement.prototype.sync = function(tinCan) {
	var statement = this.getXApiStatement();
	var filterFuntions = this.kTouchUser.getApp().getFilterFunctions();

	for (var i = 0; i < filterFuntions.length; i++) {
		if (!filterFuntions[i](statement)) {
			var thenable = new Thenable();
			thenable.resolve();
			return thenable;
		}
	}

	var tinCanSync = new TinCanSync(tinCan);
	var thenable = tinCanSync.syncStatement(statement)

	return thenable;
}

/**
 * Get correctness percentage.
 * @method getCorrectPercentage
 */
LevelStatement.prototype.getCorrectPercentage = function() {
	return 100 * this.levelStats.getCorrects() / this.levelStats.getChars();
}

/**
 * Is this complete?
 * @method isComplete
 */
LevelStatement.prototype.isComplete = function() {
	if (this.getCorrectPercentage() < this.kTouchUser.getApp().getCompletionPercentage())
		return false;

	if (this.levelStats.getChars() < this.kTouchUser.getApp().getCompletionChars())
		return false;

	return true;
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