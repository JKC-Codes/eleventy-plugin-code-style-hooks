// Regex = look behind to check for start of line or whitespace in a non-capture group
const classStart = String.raw`(?<=^|\s)`;

// Regex = look ahead to check for end of line or whitespace in a non-capture group
const classEnd = String.raw`(?=$|\s)`;

// Regex = 'lang' + optional 'uage' in a non-capture group
const languageStart = String.raw`lang(?:uage)?`;

// Regex = 1 or more letters, numbers, underscores or dashes in a capture group
const languageName = String.raw`([\w-]+)`;


module.exports = {
	// 'lang-xxxx' or 'language-xxxx'
	classLanguage: String.raw`${classStart}${languageStart}-${languageName}${classEnd}`,
	// 'no-lang', 'no-language', 'no-lang-xxxx' or 'no-language-xxxx'
	classExclude: String.raw`${classStart}no-${languageStart}(?:-${languageName})?${classEnd}`
}