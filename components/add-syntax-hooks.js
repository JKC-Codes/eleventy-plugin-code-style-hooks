const Prism = require('prismjs');
const loadLanguage = require('prismjs/components/');
const parseHTML = require('posthtml-parser');
const renderHTML = require('posthtml-render');

module.exports = function(content, state, language, usingPostHTML) {
	// Prism only loads markup, css, clike and javascript by default
	if(!Prism.languages[language]) {
		loadLanguage.silent = true;
		loadLanguage([language]);
	}

	if(Prism.languages[language]) {
		// Convert string to abstract syntax tree so Prism doesn't highlight inserted spans
		let tree = addSyntaxHooks(parseHTML(content[state.index]), language, usingPostHTML);

		// Insert AST and update index to prevent infinite loops
		content.splice(state.index, 1, ...tree);
		state.index += tree.length -1;
	}
}


function addSyntaxHooks(node, language, usingPostHTML) {
	return node.reduce((acc, cur) => {
		if(typeof cur === 'string') {
			// Make sure Prism doesn't highlight escape characters
			const parsedHTML = renderHTML(parseHTML(cur, {decodeEntities: true}));
			const highlightedHTML = Prism.highlight(parsedHTML, Prism.languages[language], language);

			if(usingPostHTML) {
				return acc.concat(parseHTML(highlightedHTML));
			}
			else {
				return acc.concat([highlightedHTML]);
			}
		}
		else if(node.hasOwnProperty('content')) {
			const newNode = cur;

			newNode.content = addSyntaxHooks(newNode.content, language, usingPostHTML);

			return acc.concat([newNode]);
		}
		else {
			return acc.concat([cur]);
		}
	}, []);
}