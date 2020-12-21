// Regex = look behind to check for start of line or whitespace in a non-capture group
const wordStart = String.raw`(?<=^|\s)`;

// Regex = look ahead to check for end of line or whitespace in a non-capture group
const wordEnd = String.raw`(?=$|\s)`;

// Regex = 'lang' + optional 'uage' in a non-capture group
const languageStart = String.raw`lang(?:uage)?`;

// Regex = 1 or more letters, numbers, underscores or dashes in a capture group
const languageName = String.raw`([\w-]+)`;

// Regex = optional return + new line
const lineNew = String.raw`((?:\r)?\n)`;


module.exports = {
	wordStart,
	wordEnd,
	// 'lang-xxxx' or 'language-xxxx'
	classLanguage: String.raw`${wordStart}${languageStart}-${languageName}${wordEnd}`,
	// 'line-numbers'
	classLineNumbers: String.raw`${wordStart}line-numbers${wordEnd}`,
	// 'data-line-numbers' or 'data-show-language' or 'data-highlight-syntax' or 'data-show-color'
	attributeData: String.raw`^data-(line-numbers|show-language|highlight-syntax|show-color)$`,
	// new line
	lineNew
}