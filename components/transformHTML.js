const posthtml = require('posthtml');

module.exports = function(HTMLString) {
	return posthtml([
		highlightCode(),
		addCSS()
	])
	.process(HTMLString)
	.then(result => result.html)
}