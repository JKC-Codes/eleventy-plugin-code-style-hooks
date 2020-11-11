const pluginSyntaxHighlighter = require('./index.js');

module.exports = function(eleventyConfig) {

	eleventyConfig.addPlugin(pluginSyntaxHighlighter, {
		allowMarkup: false,
		styles: [
			'https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/themes/prism.min.css',
			{
				href: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/themes/prism-dark.min.css',
				media: '(prefers-color-scheme: dark)'
			}
		]
	});

	return {
		dir: {
			input: './tests/test-site/',
			output: './tests/test-site/_site'
		}
	};
};