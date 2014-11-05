module.exports = function(statement) {
	if (new Date(statement.timestamp)>new Date())
		return false;

	return true;
}