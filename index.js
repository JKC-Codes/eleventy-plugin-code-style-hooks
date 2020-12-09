const posthtml = require('posthtml');
const defaultOptions = require('./components/options-default.js');
const parseOptions = require('./components/options-parser.js');
const addCodeStyleHooks = require('./components/add-code-style-hooks.js');

module.exports = function(eleventyConfig, userOptions) {

	const options = Object.assign({}, defaultOptions, parseOptions(userOptions));

	eleventyConfig.addTransform('codeStyleHooks', function(HTMLString, outputPath) {

		if(outputPath && outputPath.endsWith('.html')) {
			return posthtml([addCodeStyleHooks(options)])
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