const pluginStyleHooks = require('./index.js');

module.exports = function(eleventyConfig) {

	eleventyConfig.addPlugin(pluginStyleHooks, {
		defaultLanguage: null,
		highlightSyntax: true,
		removeRedundancy: true,
		showColors: true,
		showLanguages: true,
		showLineNumbers: true,
		scripts: [
			'/scripts/toggleLineNumbers.js',
			{
				src: '/scripts/foo.js',
				defer: ''
			}
		],
		styles: [
			'/styles/prism.css',
			{
				href: '/styles/prism-dark.css',
				media: '(prefers-color-scheme: dark)'
			},
			'/styles/line-numbers.css',
			'/styles/colour-previews.css'
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