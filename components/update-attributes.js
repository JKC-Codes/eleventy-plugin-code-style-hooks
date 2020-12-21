const regEx = require('./regular-expressions.js');

module.exports = function(node, state, removeRedundancy) {
	const isCode = node.tag === 'code';
	const isPre = node.tag === 'pre';
	const attributes = node.attrs || {};

	if(removeRedundancy) {
		removeInlineOptions(attributes);

		if(!isPre && !isCode && attributes.class) {
			removeClass(attributes, `${regEx.classLanguage}|${regEx.classLineNumbers}`);
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

			// Add line-numbers class to Pre parent
			if(!state.isChildOfPre.attrs) {
				state.isChildOfPre.attrs = {};
			}
			addAttribute(state.isChildOfPre.attrs, 'class', 'line-numbers');
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

		// Add data-language="xxx"
		if(attributes.codeChildrenDataAttributes) {
			addAttribute(attributes, 'data-language', attributes.codeChildrenDataAttributes);
			delete attributes.codeChildrenDataAttributes;
		}
	}

	if(removeRedundancy && (isCode || isPre)) {
		// Remove duplicate language and line-numbers classes
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
				removeClass(attributes, languageClass);
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
			const isLanguageClass = new RegExp(regEx.classLanguage).test(className);

			if(isLanguageClass && !codeClasses.includes(className)) {
				removeClass(attributes, className);
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
		// Regex = end of line or whitespace in a non-capture group
		attributes.class = attributes.class.replace(new RegExp(String.raw`${regEx.wordStart}${regExString}(?:$|\s)`, 'g'), '');

		// Prevent creating class="" attributes
		if(attributes.class === '') {
			delete attributes.class;
		}
	}
}

function removeDuplicates(string, regExString) {
	const subject = new RegExp(String.raw`${regEx.wordStart}${regExString}${regEx.wordEnd}`);

	// Regex keeps double spaces. Regex = single space preceeded by a non-space character
	return string.split(/(?<=\S)\s/)
	.reduce((acc, cur) => {
		const isSubject = subject.test(cur);
		const isDuplicate = acc.some(word => {
			return word.trim() === cur.trim();
		});

		if(!isSubject || !isDuplicate) {
			return acc.concat(cur);
		}
		else {
			return acc;
		}
	}, [])
	.join(' ')
}