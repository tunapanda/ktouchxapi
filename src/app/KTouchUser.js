var FileUtil = require("../utils/FileUtil");
var KTouchStatsFile = require("../ktouchstats/KTouchStatsFile");
var LevelStatement = require("../ktouchxapi/LevelStatement");
var KTouchUserXApiSync = require("./KTouchUserXApiSync");
var kTouchxapi = require("../ktouchxapi");

/**
 * Process information for one ktouch user.
 * @class KTouchUser
 */
function KTouchUser(userName, stats, app) {
	this.userName = userName;
	this.stats = stats;
	this.app = app;
	this.defaultVerbPrefix = "http://www.example.com";
}

/**
 * Get KTouch stats file for the user.
 * @method getStats
 */
KTouchUser.prototype.getStats = function() {
	return this.stats;
}

/**
 * Get username.
 * @method getUserName
 */
KTouchUser.prototype.getUserName = function() {
	return this.userName
}

/**
 * Get full name.
 * @method getFullName
 */
KTouchUser.prototype.getFullName = function() {
	var passwd = this.app.getPasswd();

	if (passwd)
		return passwd.getFullNameByUserName(this.userName);

	else
		return null;
}

/**
 * Get default verb prefix.
 * @method getDefaultVerbPrefix
 */
KTouchUser.prototype.getDefaultVerbPrefix = function() {
	return this.app.getDefaultVerbPrefix();
}

/**
 * Get actor email.
 * @method getActorEmail
 */
KTouchUser.prototype.getActorEmail = function() {
	if ((kTouchxapi.emailPairs) && (this.userName in kTouchxapi.emailPairs)) {
		return kTouchxapi.emailPairs[this.userName];
	}
	else {
	var actorDomain = this.app.getActorDomain();

	if (!actorDomain)
		throw new Error("actor domain not set");

	return this.userName + "@" + actorDomain;
}
}
/**
 * Sync up information to xapi repo for this user.
 * @method syncToXApi
 */
KTouchUser.prototype.syncToXApi = function(tinCan) {
	var xApiSync = new KTouchUserXApiSync(this, this.app);
	var thenable = xApiSync.sync(tinCan);

	//console.log("thenable: " + thenable);

	return thenable;
}

/**
 * Get app reference.
 * @method getApp
 */
KTouchUser.prototype.getApp = function() {
	return this.app;
}

/**
 * Get all lecture urls for a group of users.
 * @method getAllLectureUrlsForUsers
 * @static
 */
KTouchUser.getAllLectureUrlsForUsers = function(users) {
	var allUrls = [];
	var i, u;

	for (u = 0; u < users.length; u++) {
		var stats = users[u].getStats();
		for (i = 0; i < stats.getLectureUrls().length; i++) {
			var url = stats.getLectureUrls()[i];

			if (allUrls.indexOf(url) < 0)
				allUrls.push(url);
		}
	}

	return allUrls;
}

module.exports = KTouchUser;
