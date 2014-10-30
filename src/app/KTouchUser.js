var FileUtil = require("../utils/FileUtil");
var KTouchStatsFile = require("../ktouchstats/KTouchStatsFile");

/**
 * Process information for one ktouch user.
 * @class KTouchUser
 */
function KTouchUser(userName, kTouchStats) {
	this.userName = userName;
	this.kTouchStats = kTouchStats;
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
 */
KTouchUser.prototype.getUserName = function() {
	return this.userName
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
KTouchUser.findKTouchUsers = function(baseHomeDir, statisticsFileName) {
	var allUsers = FileUtil.readdirNonDotSync(baseHomeDir);
	var kTouchUsers = [];
	var i;

	for (i = 0; i < allUsers.length; i++) {
		user = allUsers[i];
		var userStatisticsFileName = baseHomeDir + "/" + user + "/" + statisticsFileName;

		if (FileUtil.existsSync(userStatisticsFileName)) {
			kTouchUser = new KTouchUser(user, new KTouchStatsFile(userStatisticsFileName));
			kTouchUsers.push(kTouchUser);
		}
	}

	return kTouchUsers;
}

module.exports = KTouchUser;