var UserUtil = require("../utils/UserUtil");
var KTouchStatsFile = require("../ktouchstats/KTouchStatsFile");
var Thenable = require("../utils/Thenable");
var FileUtil = require("../utils/FileUtil");
var CsvHack = require("../utils/CsvHack");
var KTouchUser = require("./KTouchUser");
var fs = require("fs");

/**
 * Gather statistics for KTouch.
 * @class KTouchStats
 */
function KTouchStats() {
	this.statisticsFileName = ".kde/share/apps/ktouch/statistics.xml";
	this.csvOutputFileName = null;
	this.runThenable = null;
	this.kTouchUsers = [];
}

/**
 * Set filename where to look for ktouch statistics.
 * @method setStatisticsFileName
 */
KTouchStats.prototype.setStatisticsFileName = function(value) {
	this.statisticsFileName = value;
}

/**
 * Set filename where to save csv data.
 * @method setCsvOutputFileName
 */
KTouchStats.prototype.setCsvOutputFileName = function(value) {
	this.csvOutputFileName = value;
}

/**
 * Set base directory where to look for home folders.
 * @method setBaseHomeDir
 */
KTouchStats.prototype.setBaseHomeDir = function(value) {
	this.baseHomeDir = value;
}

/**
 * Run.
 */
KTouchStats.prototype.run = function() {
	this.runThenable = new Thenable();

	if (!this.baseHomeDir)
		this.baseHomeDir = UserUtil.getBaseHomeDir();

	if (!this.csvOutputFileName) {
		this.runThenable.notifyError("Output file not specified");

		return this.runThenable;
	}

	// Find all users that have a KTouch statistics file.
	this.kTouchUsers = KTouchUser.findKTouchUsers(this.baseHomeDir, this.statisticsFileName);

	// Find out all urls.
	var allUrls = KTouchUser.getAllLectureUrlsForUsers(this.kTouchUsers);

	// Generate csv data and save.
	var i, u;
	var user;
	var kTouchUser;
	var csvData = [];

	csvData.push(["User"].concat(allUrls));

	for (u = 0; u < this.kTouchUsers.length; u++) {
		var kTouchUser = this.kTouchUsers[u];
		var row = [];

		row.push(kTouchUser.getUserName());

		for (i = 0; i < allUrls.length; i++) {
			var url = allUrls[i];
			var lectureStats = kTouchUser.getKTouchStats().getLectureByUrl(url)

			if (lectureStats)
				row.push(lectureStats.getMaxLevelStarted());

			else
				row.push(0);
		}

		csvData.push(row);
	}

	var csvOut = CsvHack.stringify(csvData);
	fs.writeFileSync(this.csvOutputFileName, csvOut);
	this.runThenable.notifySuccess();

	return this.runThenable;
}

module.exports = KTouchStats;