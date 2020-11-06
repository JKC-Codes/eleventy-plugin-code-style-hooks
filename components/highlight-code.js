// TODO: option to need escaped HTML or not
// TODO: auto detect language?

const parseHTML = require('posthtml-render');
const Prism = require('prismjs');
const loadLanguage = require('prismjs/components/');
const regEx = require('./regular-expressions.js');

module.exports = function(codeElements) {
	codeElements.forEach(codeElement => {
		const language = getLanguage(codeElement);

		// Only highlight code blocks with a language class
		if(language) {
			if(!Prism.languages[language]) {
				// Prism only loads markup, css, clike and javascript by default
				loadLanguage.silent = true;
				loadLanguage([language]);
			}

			// Skip highlighting unrecognised languages, including 'language-none'
			if(Prism.languages[language]) {
				codeElement.content.forEach((node, index) => {
					codeElement.content[index] = Prism.highlight(parseHTML(node), Prism.languages[language], language);
				})
			}
		}
	})
}

function getLanguage(element) {
	if(element.attrs && element.attrs.class) {
		const classMatch = element.attrs.class.match(new RegExp(regEx.classLanguage));
		// Array index 1 is the language capture group
		return classMatch ? classMatch[1] : undefined;
	}
}