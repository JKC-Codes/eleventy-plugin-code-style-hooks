const Prism = require('prismjs');
const loadLanguage = require('prismjs/components/');
const regEx = require('./regular-expressions.js');

module.exports = function(codeElements, options) {
	codeElements.forEach(codeElement => {
		highlightSyntax(codeElement, options);
	})
}

function highlightSyntax(node, options) {
	// Array index 1 is the language capture group
	const language = node.attrs.class.match(new RegExp(regEx.classLanguage))[1];

	// Prism only loads markup, css, clike and javascript by default
	if(!Prism.languages[language]) {
		loadLanguage.silent = true;
		loadLanguage([language]);
	}

	// Skip highlighting unrecognised languages including 'language-none'
	if(Prism.languages[language]) {
		highlightNode(node, language);
	}
}

function highlightNode(node, language) {
	if(node.content) {
		node.content.forEach((contentItem, index) => {
			if(typeof contentItem === 'string') {
				node.content[index] = Prism.highlight(contentItem, Prism.languages[language], language);
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