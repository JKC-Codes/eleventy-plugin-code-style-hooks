const highlightCode = require('./highlight-code.js');
const addClasses = require('./add-classes.js');
const addCSS = require('./add-CSS.js');

module.exports = function(options) {
	// AST = Abstract Syntax Tree from HTML Parser
	return function(AST) {
		const preAndCodeElements = getNodes(AST, [{tag: 'code'}, {tag: 'pre'}]);
		const codeElements = preAndCodeElements.filter(element => element.tag === 'code');
		const preElements = preAndCodeElements.filter(element => element.tag === 'pre');

		addClasses(AST, codeElements, preElements);
		highlightCode(codeElements);
		addCSS(AST, codeElements);

		return AST;
	}
}

function getNodes(tree, selector) {
	let nodes = [];

	tree.match(selector, matchingNode => {
		nodes.push(matchingNode);
		return matchingNode;
	});
	return nodes;
}