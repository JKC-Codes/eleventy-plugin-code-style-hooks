const parseHTML = require('posthtml-parser');
const regEx = require('./regular-expressions.js');

module.exports = function addFirstLineNumber(lastNewLineObject) {

	if(lastNewLineObject.node.tag === 'pre' && lastNewLineObject.index === null) {
		const lineNumber = {
			tag: 'span',
			attrs: {
				class: 'token line-number',
				'aria-hidden': 'true'
			}
		};

		lastNewLineObject.node.content.unshift(lineNumber);
		// Prevent infinite loops
		lastNewLineObject.state.index++;
	}
	else if(lastNewLineObject.node.tag !== 'code') {
		const content = lastNewLineObject.node.content;
		const index = lastNewLineObject.index;
		// Regex = positive lookahead for any non-line-break characters from end of string
		const lastNewLine = new RegExp(`${regEx.lineNew}(?=.*$)`);
		const lineNumber = '<span class="token line-number" aria-hidden="true"></span>';
		// Converting the string into an abstract syntax tree prevents PostHTML plugin errors
		const parsedReplacementString = parseHTML(content[index].replace(lastNewLine, `$&${lineNumber}`));

		// Replace existing string with new syntax tree array
		content.splice(index, 1, ...parsedReplacementString);

		// Add array length to index to prevent infinite loops
		lastNewLineObject.state.index += parsedReplacementString.length - 1;
	}

	lastNewLineObject.node = {tag: 'code'}
	lastNewLineObject.index = null
	lastNewLineObject.state = null
}