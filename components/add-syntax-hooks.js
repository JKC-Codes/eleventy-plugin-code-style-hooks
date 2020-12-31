const Prism = require('prismjs');
const loadLanguage = require('prismjs/components/');
const parseHTML = require('posthtml-parser');
const renderHTML = require('posthtml-render');

module.exports = function(content, index, language) {
	// Prism only loads markup, css, clike and javascript by default
	if(!Prism.languages[language]) {
		loadLanguage.silent = true;
		loadLanguage([language]);
	}

	if(Prism.languages[language]) {
		// Make sure Prism doesn't highlight escaped characters
		const renderedHTML = renderHTML(parseHTML(content[index], {decodeEntities: true}));
		const highlightedHTML = Prism.highlight(renderedHTML, Prism.languages[language], language);

		content.splice(index, 1, highlightedHTML);
	}
}