const regEx = require('./regular-expressions.js');

module.exports = function(content, index) {
	const newLinesRegEx = new RegExp(regEx.lineNew, 'g');
	// $& = the matched string
	const lineNumber = '$&<span class="token line-number" aria-hidden="true"></span>';

	content.splice(index, 1, content[index].replace(newLinesRegEx, lineNumber));
}