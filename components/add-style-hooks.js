const Prism = require('prismjs');
const loadLanguage = require('prismjs/components/');
const regEx = require('./regular-expressions.js');

module.exports = function(codeElements) {
	codeElements.forEach(codeElement => {
			// Array index 1 is the language capture group
	const language = codeElement.attrs.class.match(new RegExp(regEx.classLanguage))[1];

	// Prism only loads markup, css, clike and javascript by default
	if(!Prism.languages[language]) {
		loadLanguage.silent = true;
		loadLanguage([language]);
	}

	// Skip highlighting unrecognised languages including 'language-none'
	if(Prism.languages[language]) {
		highlightNode(codeElement, language);
	}
	})
}

function highlightNode(node, language) {
	if(node.content) {
		node.content.forEach((contentItem, index) => {
			if(typeof contentItem === 'string') {
				let highlightedString = Prism.highlight(contentItem, Prism.languages[language], language);

				// Add line break style hooks. Regex = optional return + new line
				highlightedString = highlightedString.replace(/((?:\r)?\n)/g, '<span class="token line-break" aria-hidden="true">$&</span>');

				// Add style hook for first line number
				highlightedString = '<span class="token start-of-code" aria-hidden="true"></span>' + highlightedString;

				node.content[index] = highlightedString;
			}
			// Prevent Code within Code highlighting tokens
			else if(contentItem.tag === 'code') {
				return;
			}
			else {
				highlightNode(contentItem, language);
			}
		})
	}
}