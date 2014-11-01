var Thenable = require("../utils/Thenable");
var TinCan = require("tincanjs");

/**
 * Manage a xAPI statement corresponding to a ktouch level.
 * @class LevelStatement
 */
function LevelStatement(levelStats, actorEmail) {
	this.levelStats = levelStats;
	this.thenable = null;
	this.actorEmail = null;
	this.thenable = null;

	if (actorEmail)
		this.actorEmail = actorEmail;
}

/**
 * Set actor email.
 * @method setActorEmail
 */
LevelStatement.prototype.setActorEmail = function(actorEmail) {
	this.actorEmail = actorEmail;
}

/**
 * Get corresponding xapi statement.
 * @method getXApiStatement
 */
LevelStatement.prototype.getXApiStatement = function() {
	if (!this.actorEmail)
		throw new Error("Actor email is not set");

	//console.log(this.levelStats.getTimestamp());

	return {
		timestamp: this.levelStats.getTimestamp(),
		actor: {
			mbox: this.actorEmail
		},
		verb: {
			id: "http://adlnet.gov/expapi/verbs/experienced"
		},
		target: {
			id: this.getTargetUrl()
		}
	};
}

/**
 * Get target url.
 * @method getTargetUrl
 */
LevelStatement.prototype.getTargetUrl = function() {
	var url = this.levelStats.getLecture().getUrl();

	if (url == "default")
		url = "http://example.com/default";

	return url + "#" + this.levelStats.getNumber();
}

/**
 * Check if exists, if not, insert.
 * @method sync
 */
LevelStatement.prototype.sync = function(tinCan) {
	if (tinCan)
		this.tinCan = tinCan;

	if (!this.thenable)
		this.thenable = new Thenable();

	console.log("syncing target: " + this.getTargetUrl());

	var params = {
		"agent": new TinCan.Agent({
			"mbox": "mailto:" + this.actorEmail
		}),

		"activity": new TinCan.Activity({
			"id": this.getTargetUrl()
		})
	};

	var thenable = this.thenable;

	this.tinCan.getStatements({
		params: params,
		callback: this.onGetStatementsDone.bind(this)
	});

	return thenable;
}

/**
 * Query for previous statements done.
 * @method onGetStatementsDone
 * @private
 */
LevelStatement.prototype.onGetStatementsDone = function(err, result) {
	if (err) {
		this.thenable.reject(err);
		this.thenable = null;
		return;
	}

	//console.log("got previous: " + result.statements.length);
	//console.log(result);

	for (var i = 0; i < result.statements.length; i++) {
		var statement = result.statements[i];

		if (statement.timestamp == this.levelStats.getTimestamp()) {
			//console.log("statement already exists");
			var thenable = this.thenable;

			thenable.resolve();
			return;
		}
	}

	this.insert();
}

/**
 * Insert into xAPI repo.
 * @method insert
 */
LevelStatement.prototype.insert = function(tinCan) {
	if (tinCan)
		this.tinCan = tinCan;

	if (!this.thenable)
		this.thenable = new Thenable();

	this.tinCan.sendStatement(this.getXApiStatement(), this.onInsertDone.bind(this));
	return this.thenable;
}

/**
 * Insert done.
 * @method onInsertDone
 */
LevelStatement.prototype.onInsertDone = function(res) {
	var thenable = this.thenable;
	this.thenable = null;

	if (res[0].err !== null)
		thenable.reject(res[0]);

	else
		thenable.resolve();
}

module.exports = LevelStatement;