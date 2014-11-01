#!/usr/bin/env node


function usage() {
	console.log("ktouchxapi - Gather information about KTouch progress for all users of a system.");
	console.log();
	console.log("At least one of the options --csv or --xapiEndpoint needs to specified.");
	console.log();
	console.log("Options:");
	console.log("    --config <filename.yml>   - Read config options from file in yml format.")
	console.log("    --csv <filename>          - Filename to write output csv to.");
	console.log("    --home <directory>        - Directory to scan for users.");
	console.log("                                Default is system dependent.");
	console.log("    --stats <filename>        - Filename relative to user home directory");
	console.log("                                where KTouch statistics is found. Default is");
	console.log("                                .kde/share/apps/ktouch/statistics.xml");
	console.log("    --xapiEndpoint <url>      - Specify xApi endpoint url.");
	console.log("    --xapiUser <username>     - Specify xApi username.");
	console.log("    --xapiPassword <pw>       - Specify xApi password.");
	console.log("    --actorDomain <domain>    - Records for xApi will be saved as username@domain.");
	console.log("    --defaultVerbPrefix <pfx> - Prefix to use for verbs in case the does not");
	console.log("                                provide a proper url.");
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

if (config["defaultVerbPrefix"])
	kTouchStats.setDefaultVerbPrefix(config["defaultVerbPrefix"]);

kTouchStats.run().then(
	function() {},
	function(e) {
		console.log(e);
		process.exit(1);
	}
);