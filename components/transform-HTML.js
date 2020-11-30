const regEx = require('./regular-expressions.js');
const addLanguageClasses = require('./add-language-classes.js');
const addLineHooks = require('./add-line-hooks.js');
const addSyntaxHooks = require('./add-syntax-hooks.js');
const addCSS = require('./add-CSS.js');

module.exports = function(options) {
	// AST = Abstract Syntax Tree from HTML Parser
	return function(AST) {
		const [codeElements, preElements] = getNodes(AST, [{tag: 'code'}, {tag: 'pre'}]);

		if(codeElements.length > 0) {
			addLanguageClasses(AST, codeElements, preElements, options);

			const codeWithLang = codeElements.filter(element => {
				return element.attrs && new RegExp(regEx.classLanguage, 'i').test(element.attrs.class);
			});

			if(codeWithLang.length > 0) {
				addLineHooks(preElements);
				addSyntaxHooks(codeWithLang);
				addCSS(AST, options);
			}
		}
		return AST;
	}
}

function getNodes(tree, selector) {
	const nodes = [[], []];

	tree.match(selector, matchingNode => {
		if(matchingNode.tag === 'code') {
			nodes[0].push(matchingNode);
		}
		else {
			nodes[1].push(matchingNode);
		}
		return matchingNode;
	});

	return nodes;
}