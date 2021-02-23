const regEx = require('./regular-expressions.js');

module.exports = function(node, state, removeRedundancy) {
	const isCode = node.tag && node.tag.toLowerCase() === 'code';
	const isPre = node.tag && node.tag.toLowerCase() === 'pre';
	const attributes = node.attrs || {};

	if(removeRedundancy) {
		removeInlineOptions(attributes);

		if(!isPre && !isCode && attributes[getAttributeKey('class', attributes)]) {
			removeClass(attributes, regEx.classLanguage);
		}
	}

	if(isCode) {
		normaliseClasses(attributes);

		// Add class="language-xxx"
		if(state.highlightSyntax && state.language) {
			updateCodeLanguageClasses(attributes, state, removeRedundancy);

			// Add data-language="xxx"
			if(state.languageLabels && state.language) {
				addAttribute(attributes, 'data-language', state.language);

				if(state.isChildOfPre) {
					// Add a temporary attribute to Pre parent so a language attribute can be added later
					if(!state.isChildOfPre.attrs) {
						state.isChildOfPre.attrs = {};
					}
					addAttribute(state.isChildOfPre.attrs, 'codeChildrenDataAttributes', state.language);
				}
			}
		}
		else if(removeRedundancy) {
			removeClass(attributes, regEx.classLanguage);
		}

		// Add class="line-numbers"
		if(state.lineNumbers && state.isChildOfPre) {
			addAttribute(attributes, 'class', 'line-numbers');

			// Add a temporary attribute to Pre parent so line-numbers class can be added later
			if(!state.isChildOfPre.attrs) {
				state.isChildOfPre.attrs = {};
			}
			addAttribute(state.isChildOfPre.attrs, 'codeChildrenClasses', 'line-numbers');
		}
		else if(removeRedundancy) {
			removeClass(attributes, regEx.classLineNumbers);
		}
	}
	else if(isPre) {
		normaliseClasses(attributes);

		// Add class="language-xxx line-numbers"
		if(attributes.codeChildrenClasses) {
			updatePreClasses(attributes, removeRedundancy);
		}
		else if(removeRedundancy && attributes[getAttributeKey('class', attributes)]) {
			removeClass(attributes, `${regEx.classLanguage}|${regEx.classLineNumbers}`);
		}

		// Add data-language="xxx"
		if(attributes.codeChildrenDataAttributes) {
			addAttribute(attributes, 'data-language', attributes.codeChildrenDataAttributes);
			delete attributes.codeChildrenDataAttributes;
		}
	}

	// Remove duplicate language and line-numbers classes
	if(removeRedundancy && (isCode || isPre)) {
		const classKey = getAttributeKey('class', attributes);
		const languageKey = getAttributeKey('data-language', attributes);

		if(attributes[classKey]) {
			attributes[classKey] = removeDuplicates(attributes[classKey], `${regEx.classLanguage}|${regEx.classLineNumbers}`);
		}

		// Remove duplicate data-language attributes
		if(attributes[languageKey]) {
			attributes[languageKey] = [...new Set(attributes[languageKey].split(' '))].join(' ');
		}
	}

	if(Object.keys(attributes).length > 0) {
		node.attrs = attributes;
	}
	else {
		delete node.attrs;
	}
}


function getAttributeKey(attribute, attributes) {
	// Can't access keys directly because of case sensitivity
	for(const key of Object.keys(attributes)) {
		if(key.toLowerCase() === attribute.toLowerCase()) {
			return key;
		}
	}
}


function updateCodeLanguageClasses(attributes, state, removeRedundancy) {
	const validLanguageClass = `language-${state.language.toLowerCase()}`;
	const validLanguageRegEx = new RegExp(`${regEx.wordStart}${validLanguageClass}${regEx.wordEnd}`);
	const classKey = getAttributeKey('class', attributes);

	// If no matching language class, add it
	if(!validLanguageRegEx.test(attributes[classKey])) {
		addAttribute(attributes, 'class', validLanguageClass);
	}

	if(removeRedundancy && attributes[classKey]) {
		const languageClasses = attributes[classKey].match(new RegExp(regEx.classLanguage, 'g'));

		languageClasses.forEach(languageClass => {
			if(!validLanguageRegEx.test(languageClass)) {
				removeClass(attributes, String.raw`${regEx.wordStart}${languageClass}${regEx.wordEnd}`);
			}
		});
	}

	if(state.isChildOfPre) {
		// Add a temporary attribute to Pre parent so language classes can be added later
		if(!state.isChildOfPre.attrs) {
			state.isChildOfPre.attrs = {};
		}
		addAttribute(state.isChildOfPre.attrs, 'codeChildrenClasses', validLanguageClass);
	}
}

function updatePreClasses(attributes, removeRedundancy) {
	const codeClasses = attributes.codeChildrenClasses.split(' ');
	const classKey = getAttributeKey('class', attributes);

	if(removeRedundancy && attributes[classKey]) {
		const preClasses = attributes[classKey].split(' ');

		preClasses.forEach(className => {
			const languageOrLineNumberRegEx = new RegExp(`${regEx.classLanguage}|${regEx.classLineNumbers}`);
			const isLanguageOrLineNumberClass = languageOrLineNumberRegEx.test(className);

			if(isLanguageOrLineNumberClass && !codeClasses.includes(className)) {
				removeClass(attributes, String.raw`${regEx.wordStart}${className}${regEx.wordEnd}`);
			}
		})
	}

	codeClasses.forEach(className => {
		addAttribute(attributes, 'class', className);
	})

	delete attributes.codeChildrenClasses;
}

function removeInlineOptions(attributes) {
	Object.keys(attributes).forEach(key => {
		if(new RegExp(regEx.attributeData, 'i').test(key)) {
			delete attributes[key];
		}
	})
}

function normaliseClasses(attributes) {
	const classKey = getAttributeKey('class', attributes);

	if(attributes[classKey]) {
		const languageOrLineNumbers = new RegExp(`${regEx.classLanguage}|${regEx.classLineNumbers}`, 'gi');

		function lowerCaseAndReplace(match) {
			return match.toLowerCase().replace('lang-', 'language-');
		};

		attributes[classKey] = attributes[classKey].replace(languageOrLineNumbers, lowerCaseAndReplace);
	}
}

function addAttribute(attributes, attributeName, attributeValue) {
	// Can't access key directly because of case sensitivity
	const key = getAttributeKey(attributeName, attributes);

	// If attribute doesn't exist, add it with value
	if(!key) {
		attributes[attributeName] = attributeValue;
	}
	// If attribute doesn't contain value add it
	else if(!new RegExp(`${regEx.wordStart}${attributeValue}${regEx.wordEnd}`).test(attributes[key])) {
		// Only add space before value if it's not an empty string and doesn't end with whitespace
		// Regex = whitespace at end of string
		if(attributes[key] !== '' && !/\s$/.test(attributes[key])) {
			attributeValue = ' ' + attributeValue;
		}
		attributes[key] += attributeValue;
	}
}

function removeClass(attributes, regExString) {
	const classKey = getAttributeKey('class', attributes);

	if(attributes[classKey]) {
		attributes[classKey] = removeWord(attributes[classKey], regExString);

		// Don't create class="" attributes
		if(attributes[classKey] === '') {
			delete attributes[classKey];
		}
	}
}

function removeDuplicates(string, regExString) {
	const matchRegEx = new RegExp(String.raw`${regEx.wordStart}${regExString}${regEx.wordEnd}`, 'g');
	let match;
	let newString = string;

	while((match = matchRegEx.exec(newString)) !== null) {
		// The lastIndex - 1 prevents the removeWord function from thinking there are no other words
		const start = newString.slice(0, matchRegEx.lastIndex - 1);
		// Remove duplicate matches
		const end = removeWord(newString.slice(matchRegEx.lastIndex - 1), match[0]);

		newString = start + end;
	}

	return newString;
}

function removeWord(string, regExString) {
	const matchRegEx = new RegExp(String.raw`${regEx.wordStart}${regExString}${regEx.wordEnd}`, 'g');
	let match;
	let newString = '';
	let previousLastIndex = 0;

	while((match = matchRegEx.exec(string)) !== null) {
		// Regex = non-whitespace character
		const hasOtherWords = /\S/.test(string.replace(match[0], ''));

		// If there aren't other words then any whitespace must be deliberate
		if(hasOtherWords) {
			// If at start of string
			if(match.index === 0) {
				// Remove whitespace from end of word
				matchRegEx.lastIndex++;
			}
			else {
				// Remove whitespace from start of word
				match.index--;
			}
		}

		// Add to new string without matched word
		newString += string.slice(previousLastIndex, match.index);

		previousLastIndex = matchRegEx.lastIndex;
	}

	// Add remaining non-matched characters
	return newString += string.slice(previousLastIndex);
}