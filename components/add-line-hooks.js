const regEx = require('./regular-expressions.js');
const parseHTML = require('posthtml-parser');

module.exports = function(preElements) {
	preElements.forEach(preElement => {
		if(preElement.content) {
			let lastNewLine;
			walkPreElement(preElement, preElement, lastNewLine);
		}
	})
}

function walkPreElement(preElement, node, lastNewLine) {
	for(let i = 0; i < node.content.length; i++) {
		const hasClassLanguage = node.content[i].attrs && new RegExp(regEx.classLanguage, 'i').test(node.content[i].attrs.class);

		if(node.content[i].tag === 'code' && hasClassLanguage) {
			if(lastNewLine === undefined) {
				const lineBreak = {
					tag: 'span',
					attrs: {
						class: 'token line-break',
						'aria-hidden': 'true'
					}
				};
				preElement.content = [lineBreak].concat(preElement.content);
				i++;
			}
			else if(lastNewLine !== 'code') {
				// Regex = positive lookahead for any non-line-break characters from end of string
				const newLine = new RegExp(`${regEx.lineNew}(?=.*$)`);
				const span = '<span class="token line-break" aria-hidden="true">$&</span>';
				lastNewLine.content[lastNewLine.index] = lastNewLine.content[lastNewLine.index].replace(newLine, span);
			}

			lastNewLine = 'code';
			addLineNumbers(node.content[i]);
		}
		else if(new RegExp(regEx.lineNew).test(node.content[i])) {
			lastNewLine = {
				content: node.content,
				index: i
			};
		}
	}
}

function addLineNumbers(node) {
	if(node.content) {
		for(let i = 0; i < node.content.length; i++) {
			if(typeof node.content[i] === 'string') {
				// Wrap new lines in span
				const replacedString = node.content[i].replace(new RegExp(regEx.lineNew, 'g'), '<span class="token line-break" aria-hidden="true">$&</span>');

				// Converting the string into an Abstract syntax tree prevents Prism highlighting HTML tags
				const parsedString = parseHTML(replacedString);

				// Replace existing string with new array
				node.content.splice(i, 1, ...parsedString);

				// Add array length to index to prevent infinite loops
				i += parsedString.length - 1;
			}
			else {
				addLineNumbers(node.content[i]);
			}
		}
	}
}