var Thenable = require("../utils/Thenable");
var TinCan = require("tincanjs");
var url = require("url");

/**
 * Manage a xAPI statement corresponding to a ktouch level.
 * @class LevelStatement
 */
function LevelStatement(levelStats, actorEmail) {
	this.levelStats = levelStats;
	this.thenable = null;
	this.actorEmail = null;
	this.thenable = null;
	this.defaultVerbPrefix = "http://www.example.com/"
	this.name = null;
	this.filterFuntions = [];

	if (actorEmail)
		this.actorEmail = actorEmail;
}

/**
 * Add a filter function.
 * @method addFilterFunction
 */
LevelStatement.prototype.addFilterFunction = function(f) {
	this.filterFuntions.push(f);
}

/**
 * Add several filter functions.
 * @method addFilterFunctions
 */
LevelStatement.prototype.addFilterFunctions = function(f) {
	this.filterFuntions = this.filterFuntions.concat(f);
}

/**
 * Set actor email.
 * @method setActorEmail
 */
LevelStatement.prototype.setActorEmail = function(actorEmail) {
	this.actorEmail = actorEmail;
}

/**
 * Set name for user.
 * @methd setName
 */
LevelStatement.prototype.setName = function(name) {
	this.name = name;
}

/**
 * Set prefix to use for verbs in case the lecture is not
 * a proper url.
 * @method setDefaultVerbPrefix
 */
LevelStatement.prototype.setDefaultVerbPrefix = function(value) {
	this.defaultVerbPrefix = value;
}

/**
 * Get corresponding xapi statement.
 * @method getXApiStatement
 */
LevelStatement.prototype.getXApiStatement = function() {
	if (!this.actorEmail)
		throw new Error("Actor email is not set");

	//console.log(this.levelStats.getTimestamp());

	var statement = {
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

	if (this.name)
		statement.actor.name = this.name;

	return statement;
}

/**
 * Get target url.
 * @method getTargetUrl
 */
LevelStatement.prototype.getTargetUrl = function() {
	var targetUrl = this.levelStats.getLecture().getUrl();
	var parsedUrl = url.parse(targetUrl);

	//console.log(parsedUrl);

	if (!parsedUrl.protocol)
		targetUrl = this.defaultVerbPrefix + targetUrl;

	return targetUrl + "#" + this.levelStats.getNumber();
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

	//console.log("syncing target: " + this.getTargetUrl());

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

	var thenable = this.thenable;
	var statement = this.getXApiStatement();

	for (var i = 0; i < this.filterFuntions.length; i++) {
		if (!this.filterFuntions[i](statement)) {
			this.thenable.resolve();
			return thenable;
		}
	}

	this.tinCan.sendStatement(statement, this.onInsertDone.bind(this));

	return thenable;
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