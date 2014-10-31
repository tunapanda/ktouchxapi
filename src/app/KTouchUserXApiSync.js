var LevelStatement = require("../ktouchxapi/LevelStatement");
var Thenable = require("../utils/Thenable");

/**
 * Sync ktouch user information with xapi.
 * @class KTouchUserXApiSync
 */
function KTouchUserXApiSync(kTouchUser, tinCan) {
	this.kTouchUser = kTouchUser;
	this.tinCan = tinCan;

	this.statements = [];
	this.statementIndex = 0;
}

/**
 * Perform the sync.
 * @method sync
 */
KTouchUserXApiSync.prototype.sync = function(tinCan) {
	var i;

	this.tinCan = tinCan;

	var levelStats = this.kTouchUser.getKTouchStats().getLevelStats();
	this.statements = [];
	for (i = 0; i < levelStats.length; i++) {
		var statement = new LevelStatement(levelStats[i])
		statement.setActorEmail(this.kTouchUser.getActorEmail());
		this.statements.push(statement);
	}

	this.thenable = new Thenable();
	this.statementIndex = 0;
	this.syncNext();
}

/**
 * Sync next statement.
 * @method syncNext
 * @private
 */
KTouchUserXApiSync.prototype.syncNext = function() {
	if (this.statementIndex > this.statements.length) {
		this.thenable.resolve();
		return;
	}

	this.statements[this.statementIndex].sync(this.tinCan).then(
		this.onSyncSuccess.bind(this),
		this.onSyncError.bind(this)
	);
}

/**
 * Sync success.
 * @method onSyncSuccess
 * @private
 */
KTouchUserXApiSync.prototype.onSyncSuccess = function() {
	this.statementIndex++;
	this.syncNext();
}

/**
 * Sync error.
 * @method onSyncError
 * @private
 */
KTouchUserXApiSync.prototype.onSyncError = function(e) {
	this.thenable.reject(e);
}

module.exports = KTouchUserXApiSync;