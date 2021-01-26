module.exports = function(string, language) {
	// Regex = optional carriage return + new line at end of string
	return string.replace(/\r?\n$/, '');
}