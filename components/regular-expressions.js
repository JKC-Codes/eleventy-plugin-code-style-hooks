// Regex = look behind to check for start of line or whitespace in a non-capture group
const classStart = String.raw`(?<=^|\s)`;

// Regex = look ahead to check for end of line or whitespace in a non-capture group
const classEnd = String.raw`(?=$|\s)`;

// Regex = 'lang' + optional 'uage' in a non-capture group
const languageStart = String.raw`lang(?:uage)?`;

// Regex = 1 or more letters, numbers, underscores or dashes in a capture group
const languageName = String.raw`([\w-]+)`;

// Regex = optional return + new line
const newLine = String.raw`((?:\r)?\n)`;


module.exports = {
	// 'lang-xxxx' or 'language-xxxx'
	classLanguage: String.raw`${classStart}${languageStart}-${languageName}${classEnd}`,
	// 'line-numbers'
	classLineNumbers: String.raw`${classStart}line-numbers${classEnd}`,
	// 'data-line-numbers' or 'data-show-language' or 'data-highlight-syntax' or 'data-show-color'
	attributeData: String.raw`^data-(line-numbers|show-language|highlight-syntax|show-color)$`,
	// new line
	lineNew: newLine
}