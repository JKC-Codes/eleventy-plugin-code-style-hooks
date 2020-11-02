const highlightCode = require('./highlightCode.js');
const addCSS = require('./addCSS.js');

module.exports = function(options) {
	// AST = Abstract Syntax Tree from HTML Parser
	return function(AST) {
		const codeElements = getNodes(AST, AST, {tag: 'code'});
		const preElements = getNodes(AST, AST, {tag: 'pre'});

		highlightCode(AST, codeElements, preElements);
		addCSS(AST, codeElements);

		return AST;
	}
}

function getNodes(fullTree, tree, selector) {
	let nodes = [];

	fullTree.match.call(tree, selector, matchingNode => {
		nodes.push(matchingNode);
		return matchingNode;
	});
	return nodes;
}