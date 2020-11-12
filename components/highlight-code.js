const parseHTML = require('posthtml-render');
const Prism = require('prismjs');
const loadLanguage = require('prismjs/components/');
const regEx = require('./regular-expressions.js');

module.exports = function(codeElements, options) {
	let codeWithSyntax = [];

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
			highlightNode(codeElement, language, options.allowMarkup);
			codeWithSyntax.push(codeElement);
		}
	})

	return codeWithSyntax;
}

function highlightNode(node, language, allowMarkup) {
	node.content.forEach((contentItem, index) => {
		if(typeof contentItem === 'string' || !allowMarkup) {
			node.content[index] = Prism.highlight(parseHTML(contentItem), Prism.languages[language], language);
		}
		else {
			highlightNode(contentItem, language, allowMarkup);
		}
	})
}