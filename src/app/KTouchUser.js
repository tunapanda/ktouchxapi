var FileUtil = require("../utils/FileUtil");
var KTouchStatsFile = require("../ktouchstats/KTouchStatsFile");
var LevelStatement = require("../ktouchxapi/LevelStatement");
var KTouchUserXApiSync = require("./KTouchUserXApiSync");

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
	var actorDomain = this.app.getActorDomain();

	if (!actorDomain)
		throw new Error("actor domain not set");

	return this.userName + "@" + actorDomain;
}

/**
 * Sync up information to xapi repo for this user.
 * @method syncToXApi
 */
KTouchUser.prototype.syncToXApi = function(tinCan) {
	var xApiSync = new KTouchUserXApiSync(this);
	var thenable = xApiSync.sync(tinCan);

	//console.log("thenable: " + thenable);

	return thenable;
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