/**
 * A KTouch level.
 * @class KTouchLevel
 */
function KTouchLevel(node) {
	var commentNode = node.childNamed("LevelComment");

	this.comment = null;

	if (commentNode)
		this.comment = commentNode.val;

	var lines = node.childrenNamed("Line");

	this.numChars = 0;

	for (i = 0; i < lines.length; i++)
		this.numChars += lines[i].val.length;
}

/**
 * Get comment.
 * @method getComment
 */
KTouchLevel.prototype.getComment = function() {
	return this.comment;
}

/**
 * Get number of characters in the level
 * @method getNumChars
 */
KTouchLevel.prototype.getNumChars = function() {
	return this.numChars;
};

module.exports = KTouchLevel;