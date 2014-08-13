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
	if (os.platform() == "linux")
		return "/home"

	else if (os.platform() == "darwin")
		return "/Users"

	else
		throw "Platform not supported.";
}

/**
 * Get all users of the system.
 * TODO: How do we make this agnostic to PAM and such?
 * @method getAllUsers
 * @static
 */
UserUtil.getAllUsers = function() {
	var baseHomeDir = UserUtil.getBaseHomeDir();
	var userFiles = fs.readdirSync(baseHomeDir);
	var users = [];
	var i;

	for (i = 0; i < userFiles.length; i++)
		if (userFiles[i][0] != ".")
			users.push(userFiles[i]);

	return users;
}

/**
 * Get user home dir.
 * @method getUserHomeDir
 */
UserUtil.getUserHomeDir = function(userName) {
	return UserUtil.getBaseHomeDir() + "/" + userName;
}

module.exports = UserUtil;