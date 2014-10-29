var Thenable = require("../utils/Thenable");

/**
 * Manage a xAPI statement corresponding to a ktouch level.
 * @class LevelStatement
 */
function LevelStatement(levelStats) {
	this.levelStats = levelStats;
	this.thenable = null;
}

/**
 * Get corresponding xapi statement.
 * @method getXApiStatement
 */
LevelStatement.prototype.getXApiStatement = function() {
	console.log(this.levelStats.getTimestamp());

	return {
		timestamp: this.levelStats.getTimestamp(),
		verb: {
			id: "http://adlnet.gov/expapi/verbs/attempted"
		},
		target: {
			id: this.levelStats.getLecture().getUrl()+"#"+this.levelStats.getNumber()
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