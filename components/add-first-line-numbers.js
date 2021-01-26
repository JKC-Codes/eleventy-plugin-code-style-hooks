const regEx = require('./regular-expressions.js');

module.exports = function addFirstLineNumber(lastNewLineObject) {
	const lineNumber = {
		tag: 'span',
		attrs: {
			class: 'token line-number',
			'aria-hidden': 'true'
		}
	};

	if(lastNewLineObject.node.tag === 'pre' && lastNewLineObject.index === null) {
		lastNewLineObject.node.content.unshift(lineNumber);
		// Prevent infinite loops
		lastNewLineObject.state.index++;
	}
	else if(lastNewLineObject.node.tag !== 'code') {
		const content = lastNewLineObject.node.content;
		const index = lastNewLineObject.index;
		// Regex = positive lookahead for any non-line-break characters from end of string
		const lastNewLine = new RegExp(`${regEx.lineNew}(?=.*$)`, 'g');
		lastNewLine.exec(content[index]);
		const start = content[index].slice(0, lastNewLine.lastIndex);
		const end = content[index].slice(lastNewLine.lastIndex);
		const replacementNodes = [start, lineNumber, end];

		content.splice(index, 1, ...replacementNodes);
		// Prevent infinite loops
		lastNewLineObject.state.index += replacementNodes.length - 1;
	}

	lastNewLineObject.node = {tag: 'code'}
	lastNewLineObject.index = null
	lastNewLineObject.state = null
}