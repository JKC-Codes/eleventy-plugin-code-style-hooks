const posthtml = require('posthtml');
const defaultOptions = require('./components/options-default.js');
const parseOptions = require('./components/options-parser.js');
const transformHTML = require('./components/transform-HTML.js');

module.exports = function(eleventyConfig, options) {

	options = Object.assign({}, defaultOptions, parseOptions(options));

	eleventyConfig.addTransform('codeStyleHooks', function(HTMLString, outputPath) {

		if(outputPath && outputPath.endsWith('.html')) {
			return posthtml([transformHTML(options)])
			.process(HTMLString)
			.then(abstractSyntaxTree => {
				return abstractSyntaxTree.html
			})
		}
		else {
			return HTMLString;
		}

	});
}