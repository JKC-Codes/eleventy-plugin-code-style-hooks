const regEx = require('./regular-expressions.js');

module.exports = function(node, state, removeRedundancy) {
	const isCode = node.tag === 'code';
	const isPre = node.tag === 'pre';
	const attributes = node.attrs || {};

	if(removeRedundancy) {
		removeInlineOptions(attributes);

		if(!isPre && !isCode && attributes.class) {
			removeClass(attributes, regEx.classLanguage);
		}
	}

	if(isCode) {
		normaliseClasses(attributes);

		// Add class="language-xxx"
		if(state.highlightSyntax && state.language) {
			updateCodeLanguageClasses(attributes, state, removeRedundancy);
		}
		else if(removeRedundancy) {
			removeClass(attributes, regEx.classLanguage);
		}

		// Add class="line-numbers"
		if(state.showLineNumbers && state.isChildOfPre) {
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

		// Add data-language="xxx"
		if(state.showLanguages && state.language) {
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
	else if(isPre) {
		normaliseClasses(attributes);

		// Add class="language-xxx line-numbers"
		if(attributes.codeChildrenClasses) {
			updatePreClasses(attributes, removeRedundancy);
		}
		else if(removeRedundancy && attributes.class) {
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
		if(attributes.class) {
			attributes.class = removeDuplicates(attributes.class, `${regEx.classLanguage}|${regEx.classLineNumbers}`);
		}

		// Remove duplicate data-language attributes
		if(attributes['data-language']) {
			attributes['data-language'] = [...new Set(attributes['data-language'].split(' '))].join(' ');
		}
	}

	if(Object.keys(attributes).length > 0) {
		node.attrs = attributes;
	}
	else {
		delete node.attrs;
	}
}


function updateCodeLanguageClasses(attributes, state, removeRedundancy) {
	const validLanguageClass = `language-${state.language.toLowerCase()}`;
	const validLanguageRegEx = new RegExp(`${regEx.wordStart}${validLanguageClass}${regEx.wordEnd}`);

	// If no matching language class, add it
	if(!validLanguageRegEx.test(attributes.class)) {
		addAttribute(attributes, 'class', validLanguageClass);
	}

	if(removeRedundancy) {
		const languageClasses = attributes.class.match(new RegExp(regEx.classLanguage, 'g'));

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

	if(removeRedundancy && attributes.class) {
		const preClasses = attributes.class.split(' ');

		preClasses.forEach(className => {
			const languageOrLineNumberRegEx = new RegExp(`${regEx.classLanguage}|${regEx.classLineNumbers}`);
			const isLanguageOrLineNumberClass = new RegExp(languageOrLineNumberRegEx).test(className);

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
	if(attributes.class) {
		const languageOrLineNumbers = new RegExp(`${regEx.classLanguage}|${regEx.classLineNumbers}`, 'gi');

		function lowerCaseAndReplace(match) {
			return match.toLowerCase().replace('lang-', 'language-');
		};

		attributes.class = attributes.class.replace(languageOrLineNumbers, lowerCaseAndReplace);
	}
}

function addAttribute(attributes, attributeName, attributeValue) {
	// Can't access key directly because of case sensitivity
	const key = Object.keys(attributes).find(property => {
		return new RegExp(`^${attributeName}$`, 'i').test(property);
	});

	if(!key) {
		attributes[attributeName] = attributeValue;
	}
	else if(!new RegExp(`${regEx.wordStart}${attributeValue}${regEx.wordEnd}`).test(attributes[key])) {
		// Only add space before value if a value already exists
		if(attributes[key] !== '' && !attributes[key].endsWith(' ')) {
			attributeValue = ' ' + attributeValue;
		}
		attributes[key] += attributeValue;
	}
}

function removeClass(attributes, regExString) {
	if(attributes.class) {
		attributes.class = removeWord(attributes.class, regExString);

		// Don't create class="" attributes
		if(attributes.class === '') {
			delete attributes.class;
		}
	}
}

function removeDuplicates(string, regExString) {
	const matchRegEx = new RegExp(String.raw`${regExString}`, 'g');
	let match;
	let newString = '';
	let oldString = string;

	while((match = matchRegEx.exec(oldString)) !== null) {
		const subject = String.raw`${regEx.wordStart}${match[0]}${regEx.wordEnd}`;

		newString = oldString.slice(0, matchRegEx.lastIndex);
		oldString = removeWord(oldString.slice(matchRegEx.lastIndex), subject);
	}

	return newString + oldString;
}

function removeWord(string, regExString) {
	const matchRegEx = new RegExp(String.raw`${regExString}`, 'g');
	let lastIndex = 0;
	let match;
	let newString = '';

	while((match = matchRegEx.exec(string)) !== null) {
		let start = lastIndex;
		// -1 removes whitespace from start of word
		let end = match.index - 1;

		// Prevent leaving double spaces
		if(match.index === 0) {
			// Word is at the start of the string so whitespace after it needs to be removed
			matchRegEx.lastIndex++;
		}

		// Prevent slice starting at end when index is negative
		if(end < 0) {
			end = 0;
		}

		newString += string.slice(start, end);
		lastIndex = matchRegEx.lastIndex;
	}

	return newString + string.slice(lastIndex);
}