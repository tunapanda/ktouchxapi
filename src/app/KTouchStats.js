var UserUtil = require("../utils/UserUtil");
var KTouchStatsFile = require("../ktouchstats/KTouchStatsFile");
var Thenable = require("../utils/Thenable");
var FileUtil = require("../utils/FileUtil");
var fs = require("fs");
//var csv = require("csv");

/**
 * Gather statistics for KTouch.
 * @class KTouchStats
 */
function KTouchStats() {
	this.statisticsFileName = ".kde/share/apps/ktouch/statistics.xml";
	this.csvOutputFileName = null;
	this.runThenable = null;
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

	var allUsers = FileUtil.readdirNonDotSync(this.baseHomeDir);
	var statsByUser = {};
	var i;
	var user;

	// Find all users that have a KTouch statistics file.
	for (i = 0; i < allUsers.length; i++) {
		user = allUsers[i];
		var userStatisticsFileName = this.baseHomeDir + "/" + user + "/" + this.statisticsFileName;

		if (FileUtil.existsSync(userStatisticsFileName)) {
			statsByUser[user] = new KTouchStatsFile(userStatisticsFileName);
		}
	}

	// Find out all urls.
	var allUrls = [];

	for (user in statsByUser) {
		var stats = statsByUser[user];
		for (i = 0; i < stats.getLectureUrls().length; i++) {
			var url = stats.getLectureUrls()[i];

			if (allUrls.indexOf(url) < 0)
				allUrls.push(url);
		}
	}

	// Generate csv data and save.
	var csvData = [];

	csvData.push(["User"].concat(allUrls));

	for (user in statsByUser) {
		var row = [];
		var stats = statsByUser[user];

		row.push(user);

		for (i = 0; i < allUrls.length; i++) {
			var url = allUrls[i];
			var lectureStats = stats.getLectureByUrl(url)

			if (lectureStats)
				row.push(lectureStats.getMaxLevelStarted());

			else
				row.push(0);
		}

		csvData.push(row);
	}

	//	csv.stringify(csvData, this.onScvDataStringified.bind(this));
	fs.writeFileSync(this.csvOutputFileName, csvData.toString());
	this.runThenable.notifySuccess();

	return this.runThenable;
}

/**
 * CSV data has been stringified.
 * @method onScvDataStringified
 * @private
 */
KTouchStats.prototype.onScvDataStringified = function(error, output) {
	fs.writeFileSync(this.csvOutputFileName, output);

	this.runThenable.notifySuccess();
}

module.exports = KTouchStats;