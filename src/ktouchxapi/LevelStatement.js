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

	/*	this.actorEmail = null;
	this.defaultVerbPrefix = "http://www.example.com/"
	this.name = null;
	this.filterFuntions = [];

	//	if (actorEmail)
	this.actorEmail = null;*/
}

/**
 * Add a filter function.
 * @method addFilterFunction
 */
/*LevelStatement.prototype.addFilterFunction = function(f) {
	this.filterFuntions.push(f);
}*/

/**
 * Add several filter functions.
 * @method addFilterFunctions
 */
/*LevelStatement.prototype.addFilterFunctions = function(f) {
	this.filterFuntions = this.filterFuntions.concat(f);
}*/

/**
 * Set actor email.
 * @method setActorEmail
 */
/*LevelStatement.prototype.setActorEmail = function(actorEmail) {
	this.actorEmail = actorEmail;
}*/

/**
 * Set name for user.
 * @method setName
 */
/*LevelStatement.prototype.setName = function(name) {
	this.name = name;
}*/

/**
 * Set prefix to use for verbs in case the lecture is not
 * a proper url.
 * @method setDefaultVerbPrefix
 */
/*LevelStatement.prototype.setDefaultVerbPrefix = function(value) {
	this.defaultVerbPrefix = value;
}*/

/**
 * Get corresponding xapi statement.
 * @method getXApiStatement
 */
LevelStatement.prototype.getXApiStatement = function() {
	if (!this.kTouchUser)
		throw new Error("no user!");

	var statement = {
		timestamp: this.levelStats.getTimestamp(),
		actor: {
			mbox: this.kTouchUser.getActorEmail()
		},
		verb: {
			id: "http://adlnet.gov/expapi/verbs/experienced"
		},
		target: {
			id: this.getTargetUrl()
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

	//console.log("thenable: " + thenable);

	return thenable;
}

module.exports = LevelStatement;