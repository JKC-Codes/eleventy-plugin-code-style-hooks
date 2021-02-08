const pluginStyleHooks = require('./index.js');

module.exports = function(eleventyConfig) {

	eleventyConfig.addPlugin(pluginStyleHooks, {
		defaultLanguage: null,
		highlightSyntax: true,
		markdownTrimTrailingNewline: true,
		removeRedundancy: true,
		colorPreviews: true,
		languageLabels: true,
		lineNumbers: true,
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
			'/styles/colour-previews.css',
			'/styles/language-labels.css',
			'/styles/line-numbers.css'
		],
		prism: function(Prism) {
			Prism.languages.customlanguage = {
				'success': /test/
			}
		}
	});

	eleventyConfig.addPassthroughCopy("./tests/test-site/styles/");

	return {
		dir: {
			input: './tests/test-site/',
			output: './tests/test-site/_site'
		}
	};
};