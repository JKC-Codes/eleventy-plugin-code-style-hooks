const Prism = require('prismjs');
const loadLanguage = require('prismjs/components/');
const parseHTML = require('posthtml-parser');
const renderHTML = require('posthtml-render');
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
			addSyntaxHooks(codeElement, language);
		}
	})
}

function addSyntaxHooks(node, language) {
	if(node.content) {
		node.content.forEach((contentItem, index) => {
			if(typeof contentItem === 'string') {
				// Make sure Prism doesn't highlight escaped characters
				const renderedHTML = renderHTML(parseHTML(contentItem, {decodeEntities: true}));
				const highlightedHTML = Prism.highlight(renderedHTML, Prism.languages[language], language)

				// Escape characters again so nothing is modified
				node.content[index] = parseHTML(highlightedHTML, {decodeEntities: false});
			}
			// Prevent Code within Code highlighting tokens
			else if(contentItem.tag === 'code') {
				return;
			}
			else {
				addSyntaxHooks(contentItem, language);
			}
		})
	}
}