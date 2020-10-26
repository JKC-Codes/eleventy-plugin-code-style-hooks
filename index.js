const defaultOptions = require('./components/options-default.js');

module.exports = function(eleventyConfig, customOptions) {
	eleventyConfig.addTransform('syntaxHighlighter', function(input, ...instanceOptions) {
		return foo();
	});
}