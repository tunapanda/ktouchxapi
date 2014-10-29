var qsub = require("qsub");
var async = require("async");

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
	});

	grunt.registerTask("test", function() {
		var done = this.async();

		async.series([

			function(next) {
				var job = new qsub("./node_modules/.bin/jasmine-node");
				job.arg("test/unit");
				job.show().expect(0);

				job.run().then(next, grunt.fail.fatal);
			},

			function() {
				done();
			}
		]);
	});

	grunt.registerTask("default", function() {
		console.log("Available tasks:");
		console.log("");
		console.log("  test   - Run jasmine tests.");
	});
};