var fs = require("fs");
var os = require("os");

/**
 * User utilities.
 * @class UserUtil
 */
function UserUtil() {}

/**
 * Get base home dir.
 * TODO: How do we make this agnostic to PAM and such?
 * @method getBaseHomeDir
 * @static
 */
UserUtil.getBaseHomeDir = function() {
	if (UserUtil.baseHomeDir)
		return UserUtil.baseHomeDir;

	if (os.platform() == "linux")
		return "/home"

	else if (os.platform() == "darwin")
		return "/Users"

	else
		throw "Platform not supported.";
}

module.exports = UserUtil;