// Regex = start of line or whitespace + 'lang' + optional 'uage' + '-'
const languageClassStart = String.raw`(?:^|\s)lang(?:uage)?-`;

// Regex = a letter + 0 or more letters or numbers + 0 or more patterns of: ('-' + a letter + 0 or more letters or numbers)
const languageName = String.raw`[a-z][a-z\d]*(?:-[a-z][a-z\d]*)*`;

const languageClass = String.raw`${languageClassStart}${languageName}`;


module.exports = {
	class: {
		language: {
			className: languageClass,
			languageName: languageName,
			identifier: languageClass
		}
	}
}