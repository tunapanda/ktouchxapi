var fs = require("fs");

/**
 * File utilities
 * @class FileUtil
 */
function FileUtil() {}

/**
 * Get sub directories.
 * @method getSubDirectoriesSync
 */
FileUtil.readdirNonDotSync = function(parent) {
	var subFiles = fs.readdirSync(parent);
	var nonDotFiles = [];
	var i;

	for (i = 0; i < subFiles.length; i++)
		if (subFiles[i][0] != ".")
			nonDotFiles.push(subFiles[i]);

	return nonDotFiles;
}

/**
 * existsSync for older versions of node.
 * @method existsSync
 * @static
 */
FileUtil.existsSync = function(fileName) {
	try {
		fs.statSync(fileName);
	} catch (e) {
		if (e.code == "ENOENT")
			return false;

		else
			throw e;
	}

	return true;
}

/**
 * Get basename, i.e. the part after the last slash, for a path.
 * @method getBasename
 * @static
 */
FileUtil.getBaseName = function(path) {
	if (path.lastIndexOf("/") >= 0)
		path = path.substr(path.lastIndexOf("/") + 1);

	return path;
}

module.exports = FileUtil;