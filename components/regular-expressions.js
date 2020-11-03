// Regex = start of line or whitespace + 'lang' + optional 'uage' + '-'
const languageClassStart = String.raw`(?<=^|\s)lang(?:uage)?-`;

// Regex = 1 or more letters, numbers or underscores + end of line or whitespace
const languageName = String.raw`([\w-]+)(?=$|\s)`;

const languageClass = String.raw`${languageClassStart}${languageName}`;


module.exports = {
	class: languageClass
}