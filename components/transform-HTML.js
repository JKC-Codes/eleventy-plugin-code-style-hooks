const highlightCode = require('./highlight-code.js');
const addClasses = require('./add-classes.js');
const addCSS = require('./add-CSS.js');

module.exports = function(options) {
	// AST = Abstract Syntax Tree from HTML Parser
	return function(AST) {
		const [codeElements, preElements] = getNodes(AST, [{tag: 'code'}, {tag: 'pre'}]);

		if(codeElements.length === 0) {
			return AST;
		}
		else {
			return Promise.resolve(
				addClasses(AST, codeElements, preElements, options))
				.then(codeWithLang => {
					if(codeWithLang && codeWithLang.length > 0) {
						return highlightCode(codeWithLang, options);
					}
				})
				.then(codeWithSyntax => {
					if(codeWithSyntax && codeWithSyntax.length > 0) {
						addCSS(AST, options);
					}
					return AST;
				}
			)
		}
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