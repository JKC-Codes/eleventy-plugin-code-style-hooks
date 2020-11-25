const pluginStyleHooks = require('./index.js');

module.exports = function(eleventyConfig) {

	eleventyConfig.addPlugin(pluginStyleHooks, {
		removeRedundancy: true,
		styles: [
			'/styles/prism.css',
			{
				href: '/styles/prism-dark.css',
				media: '(prefers-color-scheme: dark)'
			},
			'/styles/line-numbers.css'
		]
	});

	eleventyConfig.addPassthroughCopy("./tests/test-site/styles/");

	return {
		dir: {
			input: './tests/test-site/',
			output: './tests/test-site/_site'
		}
	};
};