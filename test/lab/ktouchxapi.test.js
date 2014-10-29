var KTouchStatsFile = require("../../src/ktouchstats/KTouchStatsFile");

var statsFile = new KTouchStatsFile(__dirname + "/statistics.xml");

var url = statsFile.getLectureUrls()[1];
console.log("url: " + url);

var lecture = statsFile.getLectureByUrl(statsFile.getLectureUrls()[1]);
var levelStats=lecture.getLevelStats()[0];

console.log(levelStats);