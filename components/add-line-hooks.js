const regEx = require('./regular-expressions.js');
const parseHTML = require('posthtml-parser');

module.exports = function(content, index, insideCode, state) {
	if(index === null) {
		const lineBreak = {
			tag: 'span',
			attrs: {
				class: 'token line-break',
				'aria-hidden': 'true'
			}
		};

		content.unshift(lineBreak);
		state.currentIndex++;
	}
	else {
		// Regex = positive lookahead for any non-line-break characters from end of string
		const lastNewLine = new RegExp(`${regEx.lineNew}(?=.*$)`);
		const allNewLines = new RegExp(regEx.lineNew, 'g');
		const newLineRegEx = insideCode ? allNewLines : lastNewLine;
		// $& = regex capture group which in this case is the new line character(s)
		const span = '<span class="token line-break" aria-hidden="true">$&</span>';
		// Converting the string into an Abstract syntax tree prevents Prism highlighting HTML tags
		const parsedReplacementString = parseHTML(content[index].replace(newLineRegEx, span));

		// Replace existing string with new syntax tree array
		content.splice(index, 1, ...parsedReplacementString);

		// Add array length to index to prevent infinite loops
		state.currentIndex += parsedReplacementString.length - 1;
	}
}