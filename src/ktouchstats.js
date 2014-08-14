#!/usr/bin/env node

function usage() {
	console.log("ktouchstats - Gather information about KTouch progress for all users of a system.");
	console.log();
	console.log("Options:");
	console.log("    --csv <filename>    - Filename to write output csv to. Required.");
	console.log("    --home <directory>  - Directory to scan for users.");
	console.log("                          Default is system dependent.");
	console.log("    --stats <filename>  - Filename relative to user home directory");
	console.log("                          where KTouch statistics is found. Default is");
	console.log("                          .kde/share/apps/ktouch/statistics.xml");
	console.log();

	process.exit(1);
}

var KTouchStats = require("./app/KTouchStats");
var minimist = require('minimist');

var kTouchStats = new KTouchStats();
var argv = minimist(process.argv.slice(2));

if (!argv["csv"])
	usage();

if (argv["csv"])
	kTouchStats.setCsvOutputFileName(argv["csv"]);

if (argv["home"])
	kTouchStats.setBaseHomeDir(argv["home"]);

if (argv["stats"])
	kTouchStats.setStatisticsFileName(argv["stats"]);

kTouchStats.run().then(
	function() {},
	function(e) {
		console.log(e);
		process.exit(1);
	}
);