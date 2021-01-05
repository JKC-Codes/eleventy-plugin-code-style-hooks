const parseHTML = require('posthtml-parser');
const renderHTML = require('posthtml-render');
const defaultOptions = require('./components/options-default.js');
const parseOptions = require('./components/options-parser.js');
const walkTree = require('./components/walk-tree.js');

module.exports = function(eleventyConfig, userOptions) {

	const options = Object.assign({}, defaultOptions, parseOptions(userOptions), {usingPostHTML: false});

	eleventyConfig.addTransform('codeStyleHooks', function(HTMLString, outputPath) {
		if(outputPath && outputPath.endsWith('.html')) {
			return renderHTML(
				walkTree(options)(
					parseHTML(HTMLString)
				)
			);
		}
		else {
			return HTMLString;
		}
	});
}