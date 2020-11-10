const pluginSyntaxHighlighter = require('./index.js');

module.exports = function(eleventyConfig) {

	eleventyConfig.addPlugin(pluginSyntaxHighlighter, {
		allowMarkup: false,
	});

	return {
		dir: {
			input: './tests/test-site/',
			output: './tests/test-site/_site'
		}
	};
};