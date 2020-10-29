/*
TODO:
	load additional languages
	add plugins manually?
		show line numbers
		highlight specific line numbers
	auto add css
*/

const transformed = require('./components/transform-HTML.js');

module.exports = function(eleventyConfig, options) {
	eleventyConfig.addTransform('syntaxHighlighter', function(HTMLString, outputPath) {
		if(outputPath.endsWith('.html')) {
			return transformed(HTMLString);
		}
	});
}