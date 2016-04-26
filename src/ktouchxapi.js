#!/usr/bin/env node


function usage() {
	console.log("ktouchxapi - Gather information about KTouch progress for all users of a system.");
	console.log();
	console.log("At least one of the options --csv or --xapiEndpoint needs to specified.");
	console.log();
	console.log("Options:");
	console.log("    --config=<filename.yml>   - Read config options from file in yml format.");
	console.log("                                These options are the same as the cmd-line opts.")
	console.log("    --csv=<filename>          - Filename to write output csv to.");
	console.log("    --home=<directory>        - Directory to scan for users.");
	console.log("                                Default is system dependent.");
	console.log("    --stats=<filename>        - Filename relative to user home directory");
	console.log("                                where KTouch statistics is found. Default is");
	console.log("                                .kde/share/apps/ktouch/statistics.xml");
	console.log("    --xapiEndpoint=<url>      - Specify xApi endpoint url.");
	console.log("    --xapiUser=<username>     - Specify xApi username.");
	console.log("    --xapiPassword=<pw>       - Specify xApi password.");
	console.log("    --actorDomain=<domain>    - Records for xApi will be saved as ");
	console.log("                                username@domain.");
	console.log("    --targetPrefix=<pfx>      - Prefix to prepend to filenames in the stats");
	console.log("                                file to form target URIs.");
	console.log("    --useFullTargetPath       - Use full paths when forming target URIs.")
	console.log("    --passwd=<filename>       - Use information in this file, e.g. /etc/passwd,");
	console.log("                                to map usernames to full names for");
	console.log("                                xAPI statements.");
	console.log("    --filter=<filter, ...>    - Comma separated list of filters.")
	console.log("                                Available filters: nofuture");
	console.log("    --completionPercentage=#  - Specify correctness percentage for a level to");
	console.log("                                be considered complete and successful.");
	console.log("                                Default is 98");
	console.log("    --lecturePath=<path>      - Additional path where to search for lecture");
	console.log("                                files except for the full path specified in ");
	console.log("                                the lecture url.");
	console.log("    --users=<user1,user2...>  - Comma separated lists of users to sync.");
	console.log("    --emails=<filename>       - Allows csv file to customize email");
	console.log("                                addresses for each user. Correct format for csv:");
	console.log("                                <username>,<email address>");
	console.log("                                <username2>,<email address2>");
	console.log("                                etc.");
	console.log();

	process.exit(1);
}

var KTouchStats = require("./app/KTouchStats");
var minimist = require('minimist');
var yaml = require('js-yaml');
var fs = require("fs");

var kTouchStats = new KTouchStats();
var config = minimist(process.argv.slice(2));

if (config["config"]) {
	var ymlConfig = yaml.safeLoad(fs.readFileSync(config["config"]));
	for (var o in ymlConfig)
		config[o] = ymlConfig[o];
}
// Converts csv with username/email pairs to javascript object

 if (config["emails"]) {
var emailList = config["emails"];

var fileContents = fs.readFileSync(emailList);

var lines = fileContents.toString().split('\n');
var pairs = {};
for (i = 0; i < lines.length; i ++) {
  commaIndex = lines[i].indexOf(",");
  pairs[lines[i].substring(0,commaIndex)] = lines[i].substring(commaIndex+1);
}
module.exports.emailPairs = pairs;
}

if (!config["csv"] && !config["xapiEndpoint"])
	usage();

if (config["csv"])
	kTouchStats.setCsvOutputFileName(config["csv"]);

if (config["home"])
	kTouchStats.setBaseHomeDir(config["home"]);

if (config["stats"])
	kTouchStats.setStatisticsFileName(config["stats"]);

if (config["xapiEndpoint"])
	kTouchStats.setXApiEndpoint(config["xapiEndpoint"]);

if (config["xapiUser"])
	kTouchStats.setXApiUser(config["xapiUser"]);

if (config["xapiPassword"])
	kTouchStats.setXApiPassword(config["xapiPassword"]);

if (config["actorDomain"])
	kTouchStats.setActorDomain(config["actorDomain"]);

if (config["targetPrefix"])
	kTouchStats.setTargetPrefix(config["targetPrefix"]);

if (config["useFullTargetPath"])
	kTouchStats.setUseFullTargetPath(true);

if (config["passwd"])
	kTouchStats.setPasswdFileName(config["passwd"]);

if (config["filter"]) {
	var filters = config["filter"].split(",");

	for (var i = 0; i < filters.length; i++) {
		var filter = filters[i].trim();
		var filterFunction = require("./filters/" + filter);

		kTouchStats.addFilterFunction(filterFunction);
	}
}

if (config["completionPercentage"])
	kTouchStats.setCompletionPercentage(config["completionPercentage"]);

if (config["lecturePath"])
	kTouchStats.setLecturePath(config["lecturePath"]);

if (config["users"])
	kTouchStats.setUserFilter(config["users"].split(","));

kTouchStats.run().then(
	function() {},
	function(e) {
		console.log(e);
		process.exit(1);
	}
);
