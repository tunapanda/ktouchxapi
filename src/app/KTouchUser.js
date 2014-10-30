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

module.exports = KTouchUser;