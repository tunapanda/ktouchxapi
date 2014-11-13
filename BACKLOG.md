ktouchxapi backlog
==================

Todo
----

* Use proper names for lectures. Load the lecture names from the lecture file, as specified in the stats file.
  Also, accept a search path where to look for lecture files if it is not available in the exact location
  specified by the lecture file.
* Currently, the program takes a bit of time to run, and the only way to get it to continously update
  the xAPI LRS would be to run it on a cron nightly. It would be really nice if it could run as a daemon
  and monitor the statistics files for changes. This could be done for example using
  [inotify](https://www.npmjs.org/package/inotify).

Complete
--------

* Use the verb "completed" if the accuracy is above 98% and if the number of typed chars are greater than 300,
  otherwise use "attempted". The 98% figure as well as the 300 figure should be configurable by a command line /
  config option.
  Also, let this affect both the "successful" and "completed" flags.
* Save the chars per minute as score.
