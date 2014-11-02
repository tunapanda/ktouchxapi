var fs = require("fs");

/**
 * Manage parsing and looking up information in the
 * /etc/passwd file.
 * @class Passwd
 */
function Passwd(passwdFileName) {
	if (!passwdFileName)
		passwdFileName = "/etc/passwd";

	this.fileName = passwdFileName;

	var passwdContent = fs.readFileSync(passwdFileName)
	var passwdLines = passwdContent.toString().split("\n");

	this.records = [];
	this.recordsByUsername = {};

	for (i = 0; i < passwdLines.length; i++) {
		var passwdLine = passwdLines[i];
		var passwdRecord = passwdLine.toString().split(":");
		this.records.push(passwdRecord);
		this.recordsByUsername[passwdRecord[0]] = passwdRecord;
	}
}

/**
 * Get file name.
 * @method getFileName
 */
Passwd.prototype.getFileName = function() {
	return this.fileName;
}

/**
 * Get record by username.
 * @method getRecordByUsername
 */
Passwd.prototype.getRecordByUsername = function(username) {
	return this.recordsByUsername[username];
}

/**
 * Get full name by username.
 * @method getFullNameByUserName
 */
Passwd.prototype.getFullNameByUserName = function(username) {
	var record = this.getRecordByUsername(username);

	if (!record)
		return null;

	return record[4].split(",")[0];
}

module.exports = Passwd;