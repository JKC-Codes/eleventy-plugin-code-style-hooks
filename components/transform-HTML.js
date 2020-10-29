const posthtml = require('posthtml');
const highlightCode = require('./highlightCode.js');
const addCSS = require('./addCSS.js');

module.exports = function(HTMLString) {
	return posthtml([
		highlightCode(),
		addCSS()
	])
	.process(HTMLString)
	.then(transformedAbstractSyntaxTree => {
		return transformedAbstractSyntaxTree.html
	})
}