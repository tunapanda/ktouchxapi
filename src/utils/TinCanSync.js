var TinCan = require("tincanjs");
var Thenable = require("./Thenable");

/**
 * Sync a statement with an xAPI store. Check if the statement already
 * exists, or a similar statement based on criteria, and if not
 * put it there.
 * @class TinCanSync
 */
function TinCanSync(tinCan) {
	this.tinCan = tinCan;
	this.thenable = null;
	this.statement = null;
	this.status = null;
}

/**
 * Sync statement.
 * @method syncStatement
 * @thenable
 */
TinCanSync.prototype.syncStatement = function(statement) {
	if (this.thenable)
		throw new Error("Operation already in progress.");

	if (!statement.actor || !statement.target || !statement.timestamp)
		throw new Error("The statement needs to have actor, target and timestamp");

	this.statement = statement;
	this.thenable = new Thenable();

	var thenable = this.thenable;

	var params = {
		"agent": new TinCan.Agent({
			"mbox": this.statement.actor.mbox
		}),

		"activity": new TinCan.Activity({
			"id": this.statement.target.id
		}),

		"since": statement.timestamp,
		"until": statement.timestamp
	};

	this.tinCan.getStatements({
		params: params,
		callback: this.onGetStatementsResult.bind(this)
	});

	return thenable;
}

/**
 * Got something.
 * @method onGetStatementsResult
 * @private
 */
TinCanSync.prototype.onGetStatementsResult = function(err, result) {
	//console.log("got statements..." + result.statements.length);

	// Error?
	if (err) {
		this.status = "error";
		this.statement = null;
		var thenable = this.thenable;
		this.thenable = null;
		thenable.reject(err);
		return;
	}

	// Something matching already exists?
	if (result.statements && result.statements.length) {
		this.status = "skip";
		this.statement = null;
		var thenable = this.thenable;
		this.thenable = null;
		thenable.resolve();
		return;
	}

	// Ok, go ahead and insert.
	this.tinCan.sendStatement(this.statement, this.onSendStatementDone.bind(this));
}

/**
 * Send statements done.
 * @method onSendStatementDone
 * @private
 */
TinCanSync.prototype.onSendStatementDone = function(res) {
	this.status = "inserted";
	this.statement = null;

	var thenable = this.thenable;
	this.thenable = null;

	if (res[0].err !== null)
		thenable.reject(res[0]);

	else
		thenable.resolve();
}

/**
 * Get status.
 * @method getStatus
 */
TinCanSync.prototype.getStatus = function() {
	return this.status;
}

module.exports = TinCanSync;