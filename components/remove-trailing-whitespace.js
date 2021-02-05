module.exports = function(string, language) {
	// Fix skipping Markdown causing HTML to not be escaped
	const escapedString = string.replace(/</g, '&lt;');

	// Regex = optional carriage return + new line at end of string
	return escapedString.replace(/\r?\n$/, '');
}