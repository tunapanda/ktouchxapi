var Thenable = require("../utils/Thenable");

/**
 * Manage a xAPI statement corresponding to a ktouch level.
 * @class LevelStatement
 */
function LevelStatement(levelStats) {
	this.levelStats = levelStats;
	this.thenable = null;
	this.actorEmail = null;
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

	console.log(this.levelStats.getTimestamp());

	return {
		timestamp: this.levelStats.getTimestamp(),
		actor: {
			mbox: this.actorEmail
		},
		verb: {
			id: "http://adlnet.gov/expapi/verbs/experienced"
		},
		target: {
			id: this.levelStats.getLecture().getUrl() + "#" + this.levelStats.getNumber()
		}
	};
}

/**
 * Insert into xAPI repo.
 * @method insert
 */
function insert(tincan) {
	/*	tincan.getStatements({
		params: {

		},
		callback: this.onExistsComplete.bind(this)
	});*/
}

module.exports = LevelStatement;