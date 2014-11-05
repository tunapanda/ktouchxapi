var KTouchStats = require("../../src/app/KTouchStats");
var KTouchUserXApiSync = require("../../src/app/KTouchUserXApiSync");

var kTouchStats = new KTouchStats();

kTouchStats.setBaseHomeDir(__dirname + "/ktouchstats.20141102/users");
kTouchStats.setStatisticsFileName("stats.xml");
kTouchStats.findKTouchUsers();

console.log("l: " + kTouchStats.kTouchUsers.length);
for (var i = 0; i < kTouchStats.kTouchUsers.length; i++) {
	var kTouchUser = kTouchStats.kTouchUsers[i];
	var xApiSync = new KTouchUserXApiSync(kTouchUser);
	xApiSync.createStatements();

	for (j = 0; j < xApiSync.statements.length; j++) {
		var levelStatement = xApiSync.statements[j];

		console.log("actor: " + levelStatement.actorEmail + " timestamp: " + levelStatement.levelStats.getTimestamp() + " -- " + levelStatement.getTargetUrl());
	}
}