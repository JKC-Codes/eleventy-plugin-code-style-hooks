const posthtml = require('posthtml');
const prism = require('posthtml-prism');

module.exports = function(eleventyConfig, options) {
	eleventyConfig.addTransform('syntaxHighlighter', function(code, outputPath) {
		if(outputPath.endsWith('.html')) {
			return highlight(code);
		}
		else {
			return code;
		}
	});
}

function highlight(code) {
	return posthtml([prism()])
  .process(code)
  .then(result => result.html)
}



/*
TODO:
	load additional languages
	add plugins manually?
		show line numbers
		highlight specific line numbers
	auto add css
*/