var FileUtil = require("../utils/FileUtil");
var KTouchStatsFile = require("../ktouchstats/KTouchStatsFile");
var LevelStatement = require("../ktouchxapi/LevelStatement");
var KTouchUserXApiSync = require("./KTouchUserXApiSync");

/**
 * Process information for one ktouch user.
 * @class KTouchUser
 */
function KTouchUser(userName, kTouchStats) {
	this.userName = userName;
	this.kTouchStats = kTouchStats;
	this.actorDomain = null;
}

/**
 * Get KTouch stats file for the user.
 * @method getKTouchStats
 */
KTouchUser.prototype.getKTouchStats = function() {
	return this.kTouchStats;
}

/**
 * Get username.
 * @method getUserName
 */
KTouchUser.prototype.getUserName = function() {
	return this.userName
}

/**
 * Set domain for actor email.
 * @method setActorDomain
 */
KTouchUser.prototype.setActorDomain = function(actorDomain) {
	this.actorDomain = actorDomain;
}

/**
 * Get actor email.
 * @method getActorEmail
 */
KTouchUser.prototype.getActorEmail = function() {
	if (!this.actorDomain)
		throw new Error("actor domain not set");

	return this.userName + "@" + this.actorDomain;
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
		var stats = users[u].getKTouchStats();
		for (i = 0; i < stats.getLectureUrls().length; i++) {
			var url = stats.getLectureUrls()[i];

			if (allUrls.indexOf(url) < 0)
				allUrls.push(url);
		}
	}

	return allUrls;
}

/**
 * Scan a home dir and find all ktouch users.
 * @method findKTouchUsers
 * @static
 */
KTouchUser.findKTouchUsers = function(baseHomeDir, statisticsFileName, actorDomain) {
	var allUsers = FileUtil.readdirNonDotSync(baseHomeDir);
	var kTouchUsers = [];
	var i;

	for (i = 0; i < allUsers.length; i++) {
		user = allUsers[i];
		var userStatisticsFileName = baseHomeDir + "/" + user + "/" + statisticsFileName;

		if (FileUtil.existsSync(userStatisticsFileName)) {
			kTouchUser = new KTouchUser(user, new KTouchStatsFile(userStatisticsFileName));
			kTouchUser.setActorDomain(actorDomain);
			kTouchUsers.push(kTouchUser);
		}
	}

	return kTouchUsers;
}

module.exports = KTouchUser;