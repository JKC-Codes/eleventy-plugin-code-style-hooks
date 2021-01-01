const regEx = require('./regular-expressions.js');

module.exports = function(content, index) {
	// const colorsRegEx = new RegExp(regEx.color, 'gi');
	const colorsRegEx = new RegExp(regEx.color, 'gi');
	// $& = the matched colour
	const colorPreview = '<span class="token color-value" style="--color-value: $&" aria-hidden="true"></span>$&';

	content.splice(index, 1, content[index].replace(colorsRegEx, colorPreview));
}