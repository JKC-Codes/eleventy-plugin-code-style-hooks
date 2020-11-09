/*
TODO:
show line numbers
highlight specific line numbers
add plugins manually?
auto detect language?
*/

const posthtml = require('posthtml');
const defaultOptions = require('./components/options-default.js');
const transformHTML = require('./components/transform-HTML.js');

module.exports = function(eleventyConfig, options) {

	options = Object.assign({}, defaultOptions, options);

	eleventyConfig.addTransform('syntaxHighlighter', function(HTMLString, outputPath) {

		if(outputPath && outputPath.endsWith('.html')) {
			return posthtml([transformHTML(options)])
			.process(HTMLString)
			.then(transformedAbstractSyntaxTree => {
				return transformedAbstractSyntaxTree.html
			})
		}
		else {
			return HTMLString;
		}

	});
}