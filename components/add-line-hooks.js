const regEx = require('./regular-expressions.js');
const parseHTML = require('posthtml-parser');

module.exports = function(preElements) {
	preElements.forEach(preElement => {
		if(preElement.content) {
			preElement.content.forEach(contentItem => {
				const hasClassLanguage = contentItem.attrs && new RegExp(regEx.classLanguage, 'i').test(contentItem.attrs.class);
				if(contentItem.tag === 'code' && hasClassLanguage) {
					addLineNumbers(contentItem);
				}
			})
		}
	})
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



/*

if preElement has a code element at any depth with a language class add line numbers

note last pre or new line
if code add line number to last
	enter code and replace new lines with span recursively
else if tag enter node and call itself
else return

*/