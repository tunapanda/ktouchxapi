var UserUtil = require("../utils/UserUtil");
var KTouchStatsFile = require("../ktouchstats/KTouchStatsFile");
var Thenable = require("../utils/Thenable");
var FileUtil = require("../utils/FileUtil");
var CsvHack = require("../utils/CsvHack");
var KTouchUser = require("./KTouchUser");
var TinCan = require("tincanjs");
var fs = require("fs");

/**
 * Gather statistics for KTouch.
 * @class KTouchStats
 */
function KTouchStats() {
	this.statisticsFileName = ".kde/share/apps/ktouch/statistics.xml";
	this.csvOutputFileName = null;
	this.runThenable = null;
	this.kTouchUsers = [];
	this.tinCan = null;
	this.xApiEndpoint = null;
	this.xApiUser = null;
	this.xApiPassword = null;
	this.tinCan = null;
	this.actorDomain = "example.com";
	this.userSyncIndex = 0;
}

/**
 * Set filename where to look for ktouch statistics.
 * @method setStatisticsFileName
 */
KTouchStats.prototype.setStatisticsFileName = function(value) {
	this.statisticsFileName = value;
}

/**
 * Set actor domain.
 * @method setActorDomain
 */
KTouchStats.prototype.setActorDomain = function(actorDomain) {
	this.actorDomain = actorDomain;
}

/**
 * Set filename where to save csv data.
 * @method setCsvOutputFileName
 */
KTouchStats.prototype.setCsvOutputFileName = function(value) {
	this.csvOutputFileName = value;
}

/**
 * Set base directory where to look for home folders.
 * @method setBaseHomeDir
 */
KTouchStats.prototype.setBaseHomeDir = function(value) {
	this.baseHomeDir = value;
}

/**
 * Set xapi endpoint.
 * @method setXApiEndpoint
 */
KTouchStats.prototype.setXApiEndpoint = function(value) {
	this.xApiEndpoint = value;
}

/**
 * Set xapi user.
 * @method setXApiUser
 */
KTouchStats.prototype.setXApiUser = function(value) {
	this.xApiUser = value;
}

/**
 * Set xapi password.
 * @method setXApiPassword
 */
KTouchStats.prototype.setXApiPassword = function(value) {
	this.xApiPassword = value;
}

/**
 * Run.
 */
KTouchStats.prototype.run = function() {
	this.runThenable = new Thenable();

	if (!this.baseHomeDir)
		this.baseHomeDir = UserUtil.getBaseHomeDir();

	if (!this.csvOutputFileName && !this.tinCan && !this.xApiEndpoint) {
		this.runThenable.notifyError("No output or xapi endpoint.");

		return this.runThenable;
	}

	// Find all users that have a KTouch statistics file.
	this.kTouchUsers = KTouchUser.findKTouchUsers(
		this.baseHomeDir,
		this.statisticsFileName,
		this.actorDomain);

	if (this.csvOutputFileName)
		this.generateCsv();

	if (this.xApiEndpoint) {
		console.log("using endpoint: " + this.xApiEndpoint);

		this.tinCan = new TinCan({
			recordStores: [{
				endpoint: this.xApiEndpoint,
				username: this.xApiUser,
				password: this.xApiPassword,
				allowFail: false
			}]
		});
	}

	console.log("will calll sync, tincan=" + this.tinCan);

	if (this.tinCan)
		this.syncNextUser();

	else
		this.runThenable.notifySuccess();

	console.log("returning");

	return this.runThenable;
}

/**
 * Set TinCanJS instance responsible for the xapi sync.
 * Mainly for debugging.
 * @method setTinCan
 */
KTouchStats.prototype.setTinCan = function(tinCan) {
	console.log("setting tin can");
	this.tinCan = tinCan;
}

/**
 * Generate csv file.
 * @method generateCsv
 */
KTouchStats.prototype.generateCsv = function() {
	// Find out all urls.
	var allUrls = KTouchUser.getAllLectureUrlsForUsers(this.kTouchUsers);

	// Generate csv data and save.
	var i, u;
	var user;
	var kTouchUser;
	var csvData = [];

	csvData.push(["User"].concat(allUrls));

	for (u = 0; u < this.kTouchUsers.length; u++) {
		var kTouchUser = this.kTouchUsers[u];
		var row = [];

		row.push(kTouchUser.getUserName());

		for (i = 0; i < allUrls.length; i++) {
			var url = allUrls[i];
			var lectureStats = kTouchUser.getKTouchStats().getLectureByUrl(url)

			if (lectureStats)
				row.push(lectureStats.getMaxLevelStarted());

			else
				row.push(0);
		}

		csvData.push(row);
	}

	var csvOut = CsvHack.stringify(csvData);
	fs.writeFileSync(this.csvOutputFileName, csvOut);
}

/**
 * Sync next user in sequence.
 * @method syncNextUser
 * @private
 */
KTouchStats.prototype.syncNextUser = function() {
	console.log("syncing, user index=" + this.userSyncIndex);
	if (this.userSyncIndex >= this.kTouchUsers.length) {
		this.runThenable.notifySuccess();
		return;
	}

	this.kTouchUsers[this.userSyncIndex].syncToXApi(this.tinCan).then(
		this.onUserSyncComplete.bind(this),
		this.onUserSyncError.bind(this)
	);
}

/**
 * User sync complete.
 * @method onUserSyncComplete
 * @private
 */
KTouchStats.prototype.onUserSyncComplete = function() {
	this.userSyncIndex++;
	this.syncNextUser();
}

/**
 * User sync error.
 * @method onUserSyncError
 * @private
 */
KTouchStats.prototype.onUserSyncError = function(res) {
	this.runThenable.notifyError(res);
}

module.exports = KTouchStats;