var UserUtil = require("../utils/UserUtil");
var KTouchStatsFile = require("../ktouchstats/KTouchStatsFile");
var Thenable = require("../utils/Thenable");
var FileUtil = require("../utils/FileUtil");
var CsvHack = require("../utils/CsvHack");
var KTouchUser = require("./KTouchUser");
var TinCan = require("tincanjs");
var fs = require("fs");
var Passwd = require("../utils/Passwd");
var url = require("url");
var KTouchLecture = require("../ktouchstats/KTouchLecture");

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
	this.targetPrefix = "http://www.example.com/";
	this.useFullTargetPath = false;
	this.passwd = null;
	this.filterFunctions = [];
	this.completionPercentage = 98;
	this.lecturesByUrl = {};
	this.lecturePath = null;
}

/**
 * Set lecture path.
 * @method setLecturePath
 */
KTouchStats.prototype.setLecturePath = function(path) {
	this.lecturePath = path;
}

/**
 * Get completion percentage.
 * @method getCompletionPercentage
 */
KTouchStats.prototype.getCompletionPercentage = function() {
	return this.completionPercentage;
}

/**
 * Set completion percentage.
 * @method setCompletionPercentage
 */
KTouchStats.prototype.setCompletionPercentage = function(value) {
	this.completionPercentage = value;
}

/**
 * Add a filter function
 * @method addFilterFunction
 */
KTouchStats.prototype.addFilterFunction = function(f) {
	this.filterFunctions.push(f);
}

/**
 * Get filter functions.
 * @method getFilterFunctions
 */
KTouchStats.prototype.getFilterFunctions = function() {
	return this.filterFunctions;
}

/**
 * Get passwd.
 * @method getPasswd
 */
KTouchStats.prototype.getPasswd = function() {
	return this.passwd;
}

/**
 * Set passwd file name for user mapping.
 * @method setPasswdFileName
 */
KTouchStats.prototype.setPasswdFileName = function(fn) {
	this.passwd = new Passwd(fn);
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
 * Get actor domain.
 * @method getActorDomain
 */
KTouchStats.prototype.getActorDomain = function() {
	return this.actorDomain;
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
 * Set target prefix.
 * @method setTargetPrefix
 */
KTouchStats.prototype.setTargetPrefix = function(value) {
	this.targetPrefix = value;
}

/**
 * Get target prefix.
 * @method getTargetPrefix
 */
KTouchStats.prototype.getTargetPrefix = function() {
	return this.targetPrefix;
}

/**
 * Use full target paths.
 * @method setUseFullTargetPaths
 */
KTouchStats.prototype.setUseFullTargetPath = function(value) {
	this.useFullTargetPath = value;
}

/**
 * Should full target paths be used?
 * @method getUseFullTargetPaths
 */
KTouchStats.prototype.getUseFullTargetPath = function() {
	return this.useFullTargetPath;
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
	this.findKTouchUsers();

	if (this.csvOutputFileName)
		this.generateCsv();

	if (this.xApiEndpoint) {
		console.log("** Using xAPI endpoint: " + this.xApiEndpoint);

		this.tinCan = new TinCan({
			recordStores: [{
				endpoint: this.xApiEndpoint,
				username: this.xApiUser,
				password: this.xApiPassword,
				allowFail: false
			}]
		});
	}

	if (this.tinCan)
		this.syncNextUser();

	else
		this.runThenable.notifySuccess();

	return this.runThenable;
}

/**
 * Set TinCanJS instance responsible for the xapi sync.
 * Mainly for debugging.
 * @method setTinCan
 */
KTouchStats.prototype.setTinCan = function(tinCan) {
	//console.log("setting tin can");
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
			var lectureStats = kTouchUser.getStats().getLectureByUrl(url)

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
	if (this.userSyncIndex >= this.kTouchUsers.length) {
		console.log("Sync done!");
		this.runThenable.notifySuccess();
		return;
	}

	var kTouchUser = this.kTouchUsers[this.userSyncIndex];
	console.log("Syncing: " + kTouchUser.getActorEmail());

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

/**
 * Scan home dir and find all ktouch users.
 * @method findKTouchUsers
 * @private
 */
KTouchStats.prototype.findKTouchUsers = function() {
	var allUserNames = FileUtil.readdirNonDotSync(this.baseHomeDir);
	var i;

	this.kTouchUsers = [];
	for (i = 0; i < allUserNames.length; i++) {
		userName = allUserNames[i];
		var userHomeDir = this.baseHomeDir + "/" + userName;
		if (fs.statSync(userHomeDir).isDirectory()) {
			var userStatisticsFileName = userHomeDir + "/" + this.statisticsFileName;

			if (FileUtil.existsSync(userStatisticsFileName)) {
				kTouchUser = new KTouchUser(userName, new KTouchStatsFile(userStatisticsFileName), this);
				this.kTouchUsers.push(kTouchUser);
			}
		}
	}
}

/**
 * Get a lecture by url.
 * Will only load the lecture once, then cache it.
 * @method getLectureByUrl
 */
KTouchStats.prototype.getLectureByUrl = function(fn) {
	var parsedUrl = url.parse(fn);

	if (parsedUrl.protocol == "file:")
		fn = parsedUrl.path;

	if (this.lecturesByUrl[fn])
		return this.lecturesByUrl[fn];

	var lecture;

	if (fs.existsSync(fn))
		lecture = new KTouchLecture(fn);

	else if (fs.existsSync(this.lecturePath + "/" + FileUtil.getBaseName(fn)))
		lecture = new KTouchLecture(this.lecturePath + "/" + FileUtil.getBaseName(fn));

	if (lecture)
		this.lecturesByUrl[fn] = lecture;

	return lecture;
}

module.exports = KTouchStats;