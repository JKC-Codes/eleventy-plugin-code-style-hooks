const parseHTML = require('posthtml-parser');
const renderHTML = require('posthtml-render');
const defaultOptions = require('./components/options-default.js');
const parseOptions = require('./components/options-parser.js');
const removeTrailingWhitespace = require('./components/remove-trailing-whitespace.js');
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

	if(options.markdownTrimTrailingNewline) {
		eleventyConfig.addMarkdownHighlighter(removeTrailingWhitespace);
	}
}


module.exports.posthtml = function(userOptions = {}) {
	if(!userOptions.parsed) {
		userOptions = Object.assign({}, defaultOptions, parseOptions(userOptions), {usingPostHTML: true});
	}

	return function(AST) {
		return walkTree(userOptions)(AST);
	}
}


module.exports.parser = function(userOptions) {
	return Object.assign({}, defaultOptions, parseOptions(userOptions), {usingPostHTML: true});
}


module.exports.markdownTrimTrailingNewline = function(eleventyConfig) {
	eleventyConfig.addMarkdownHighlighter(removeTrailingWhitespace);
}