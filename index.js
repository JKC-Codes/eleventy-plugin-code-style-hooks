/*
TODO:
	load additional languages
	add plugins manually?
		show line numbers
		highlight specific line numbers
	auto add css
*/

const posthtml = require('posthtml');
const transformHTML = require('./components/transform-HTML.js');

module.exports = function(eleventyConfig, options) {
	eleventyConfig.addTransform('syntaxHighlighter', function(HTMLString, outputPath) {
		if(outputPath && outputPath.endsWith('.html')) {
			return posthtml([transformHTML()])
			.process(HTMLString)
			.then(transformedAbstractSyntaxTree => {
				return transformedAbstractSyntaxTree.html
			})
		}
	});
}