const regEx = require('./regular-expressions.js');

module.exports = function(node, state, removeRedundancy) {
	const isCode = node.tag === 'code';
	const isPre = node.tag === 'pre';
	const attributes = node.attrs || {};

	if(removeRedundancy) {
		removeInlineOptions(attributes);

		if(!isPre && !isCode && attributes.class) {
			removeClass(attributes, new RegExp(regEx.classLanguage, 'i'));
			removeClass(attributes, new RegExp(regEx.classLineNumbers, 'i'));
		}
	}

	if(isCode) {
		normaliseClasses(attributes);

		// Class="language-xxx"
		if(state.highlightSyntax && state.language) {
			updateLanguageClasses(attributes, state, removeRedundancy);
		}
		else if(removeRedundancy) {
			removeClass(attributes, new RegExp(regEx.classLanguage, 'i'))
		}

		// Class="line-numbers"
		if(state.showLineNumbers && state.isChildOfPre) {
			addAttribute(attributes, 'class', 'line-numbers');

			// Add line-numbers class to Pre parent
			if(!state.isChildOfPre.attrs) {
				state.isChildOfPre.attrs = {};
			}
			addAttribute(state.isChildOfPre.attrs, 'class', 'line-numbers');
		}
		else if(removeRedundancy) {
			removeClass(attributes, new RegExp(regEx.classLineNumbers, 'i'))
		}

		// Data-language="xxx"
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

		// Class="language-xxx line-numbers"
		if(attributes.codeChildrenClasses) {
			const codeClasses = attributes.codeChildrenClasses.split(' ');

			if(removeRedundancy && attributes.class) {
				const preClasses = attributes.class.split(' ');

				preClasses.forEach(className => {
					const isLanguageClass = new RegExp(regEx.classLanguage).test(className);
					if(isLanguageClass && !codeClasses.includes(className)) {
						removeClass(attributes, new RegExp(`${regEx.classStart}${className}${regEx.classEnd}`));
					}
				})
			}

			codeClasses.forEach(className => {
				addAttribute(attributes, 'class', className);
			})

			delete attributes.codeChildrenClasses;
		}

		// Data-language="xxx"
		if(attributes.codeChildrenDataAttributes) {
			addAttribute(attributes, 'data-language', attributes.codeChildrenDataAttributes);
			delete attributes.codeChildrenDataAttributes;
		}
	}

	if(removeRedundancy && (isCode || isPre)) {
		// Remove duplicate language and line-numbers classes
		if(attributes.class) {
			attributes.class = attributes.class
			.split(' ')
			.reduce((acc, cur) => {
				const isLanguageOrLineNumbers = new RegExp(`${regEx.classLanguage}|${regEx.classLineNumbers}`).test(cur);
				const isDuplicate = acc.includes(cur);

				if(isLanguageOrLineNumbers && isDuplicate) {
					return acc;
				}
				else {
					return acc.concat(cur);
				}
			}, [])
			.join(' ');
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


function removeInlineOptions(attributes) {
	Object.keys(attributes).forEach(key => {
		if(new RegExp(regEx.attributeData, 'i').test(key)) {
			delete attributes[key];
		}
	})
}

function removeClass(attributes, classRegEx) {
	if(attributes.class) {
		attributes.class = attributes.class
		.split(' ')
		.filter(className => {
			return !classRegEx.test(className);
		})
		.join(' ');

		// Prevent creating class="" attributes
		if(attributes.class === '') {
			delete attributes.class;
		}
	}
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
	else {
		const values = attributes[key].split(' ');

		if(!values.includes(attributeValue)) {
			values.push(attributeValue);
			attributes[key] = values.join(' ');
		}
	}
}

function updateLanguageClasses(attributes, state, removeRedundancy) {
	const validLanguageClass = `language-${state.language.toLowerCase()}`;
	const validLanguageRegEx = new RegExp(`${regEx.classStart}${validLanguageClass}${regEx.classEnd}`);

	// If no matching language class, add it
	if(!validLanguageRegEx.test(attributes.class)) {
		addAttribute(attributes, 'class', validLanguageClass);
	}

	if(removeRedundancy) {
		const languageClasses = attributes.class.match(new RegExp(regEx.classLanguage, 'g'));

		languageClasses.forEach(languageClass => {
			if(!validLanguageRegEx.test(languageClass)) {
				removeClass(attributes, new RegExp(`${regEx.classStart}${languageClass}${regEx.classEnd}`));
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