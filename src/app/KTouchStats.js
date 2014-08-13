var UserUtil = require("../utils/UserUtil");

/**
 * Gather statistics for KTouch.
 */
function KTouchStats() {

}

/**
 * Run.
 */
KTouchStats.prototype.run = function() {
	var allUsers=UserUtil.getAllUsers();

	console.log(allUsers);
}

module.exports = KTouchStats;