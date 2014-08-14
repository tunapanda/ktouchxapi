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

module.exports = FileUtil;