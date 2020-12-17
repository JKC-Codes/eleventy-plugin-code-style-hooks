const regEx = require('./regular-expressions.js');

module.exports = function(node, state, removeRedundancy) {
	const isCode = node.tag === 'code';
	const isPre = node.tag === 'pre';
	let attributes = node.attrs || {};

	if(removeRedundancy) {
		removeInlineOptions(attributes);

		if(!isPre && !isCode && attributes.class) {
			removeClass(attributes, new RegExp(regEx.classLanguage, 'i'));
			removeClass(attributes, new RegExp(regEx.classLineNumbers, 'i'));
		}
	}

	if(isCode) {
		normaliseClasses(attributes);

		if(state.highlightSyntax && state.language) {
			addLanguageAttributes(attributes, state, removeRedundancy);
		}
		else if(removeRedundancy) {
			removeClass(attributes, new RegExp(regEx.classLanguage, 'i'))
		}

		if(state.showLineNumbers && state.isChildOfPre) {
			addClass(attributes, 'line-numbers');
		}
		else if(removeRedundancy) {
			removeClass(attributes, new RegExp(regEx.classLineNumbers, 'i'))
		}
	}
	else if(isPre) {
		if(attributes.codeChildrenClasses) {
			delete attributes.codeChildrenClasses;
		}


	}

	if(removeRedundancy) {
		// TODO: remove duplicates
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
		attributes = attributes.class
		.split(' ')
		.filter(className => {
			return !classRegEx.test(className);
		})
		.join(' ');
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

function addLanguageAttributes(attributes, state, removeRedundancy) {
	const validLanguageClass = `language-${state.language.toLowerCase()}`;
	const validLanguageRegEx = new RegExp(`${regEx.classStart}${validLanguageClass}${regEx.classEnd}`);

	// If no matching language class, add it
	if(!validLanguageRegEx.test(attributes.class)) {
		addClass(attributes, validLanguageClass);
	}

	if(removeRedundancy) {
		const languageClasses = attributes.class.match(new RegExp(regEx.classLanguage, 'g'));

		languageClasses.forEach(languageClass => {
			if(!validLanguageRegEx.test(languageClass)) {
				removeClass(attributes, new RegExp(`${regEx.classStart}${languageClass}${regEx.classEnd}`));
			}
		});
	}

	if(state.showLanguages) {
		addAttribute(attributes, 'data-language', state.language);
	}

	if(state.isChildOfPre) {
		// Add a temporary attribute to Pre parent so language classes can be inherited
		if(!state.isChildOfPre.attrs) {
			state.isChildOfPre.attrs = {};
		}
		addAttribute(state.isChildOfPre.attrs, 'codeChildrenClasses', state.language.toLowerCase());
		if(state.showLanguages) {
			addAttribute(state.isChildOfPre.attrs, 'codeChildrenDataAttributes', state.language);
		}
	}
}

function addClass(attributes, className) {
	let classes = attributes.class ? attributes.class.split(' ') : [];

	if(!classes.includes(className)) {
		classes.push(className);
		attributes.class = classes.join(' ');
	}
}

function addAttribute(attributes, attributeName, attributeValue) {
	// Can't access key directly because of case sensitivity
	const key = Object.keys(attributes).find(property => {
		return new RegExp(attributeName, 'i').test(property);
	});

	if(!key) {
		attributes[attributeName] = attributeValue;
	}
	else if(!attributes[key].includes(attributeValue)) {
		attributes[key] = `${attributes[key]} ${attributeValue}`;
	}
}