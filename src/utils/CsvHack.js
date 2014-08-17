/**
 * Hack for writing csv files in order to be able to use old versions on nodejs.
 * The "specification" is mainly from here:
 * http://stackoverflow.com/questions/769621/dealing-with-commas-in-a-csv-file
 * @class CsvHack
 */
function CsvHack() {}

/**
 * Check if a field needs escaping.
 * @method needsEscaping
 */
CsvHack.needsEscaping = function(value) {
	value = value.toString();

	if (value.indexOf('"') >= 0)
		return true;

	if (value.indexOf(",") >= 0)
		return true;

	if (value.indexOf("\n") >= 0)
		return true;

	return false;
}

/**
 * Escape field.
 * @method escapeField
 */
CsvHack.escapeField = function(value) {
	value = value.replace(/"/g, '""');

	return '"' + value + '"';
}

/**
 * Escape field.
 * @method escapeField
 */
CsvHack.escapeIfNeeded = function(value) {
	if (CsvHack.needsEscaping(value))
		return CsvHack.escapeField(value);

	else
		return value;
}

/**
 * Stringify data.
 * @method stringify
 */
CsvHack.stringify = function(data) {
	var output = "";
	var i, j, row, escapedRow;

	for (i = 0; i < data.length; i++) {
		row = data[i];
		escapedRow = [];

		for (j = 0; j < row.length; j++)
			escapedRow.push(CsvHack.escapeIfNeeded(row[j]));

		output += escapedRow.join(",") + "\n";
	}

	return output;
}

module.exports = CsvHack;