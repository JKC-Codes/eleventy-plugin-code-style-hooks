const regEx = require('./regular-expressions.js');

module.exports = function(attributes, parentNode, parentState) {
	const dataAttributes = attributes ? getDataAttributes(attributes) : {};
	const classes = attributes ? getClasses(attributes) : {};
	const state = Object.assign({}, parentState, dataAttributes, classes);

	if(parentNode.tag && parentNode.tag.toLowerCase() === 'pre') {
		state.isChildOfPre = parentNode;
	}
	else if(parentNode.tag && parentNode.tag.toLowerCase() === 'code') {
		state.isChildOfCode = true;
	}

	return state;
}


function getDataAttributes(attributes) {
	const state = {};

	for(let key of Object.keys(attributes)) {
		if(new RegExp(regEx.attributeData, 'i').test(key)) {
			// If value is 'true' or omitted return true
			const value = attributes[key].toLowerCase() === 'false' ? false : true;

			switch(key.toLowerCase()) {
				case 'data-highlight-syntax': state.highlightSyntax = value;
				break;
				case 'data-color-previews': state.colorPreviews = value;
				break;
				case 'data-language-labels': state.languageLabels = value;
				break;
				case 'data-line-numbers': state.lineNumbers = value;
				break;
			}
		}
	}

	return state;
}

function getClasses(attributes) {
	let classesString = '';
	// Can't access key directly because of case sensitivity
	for(const [key, value] of Object.entries(attributes)) {
		if(key.toLowerCase() === 'class') {
			classesString = value;
			break;
		}
	}

	const state = {};
	const languageClass = classesString.match(new RegExp(regEx.classLanguage, 'i'));

	if(languageClass) {
		// [1] = capture group with the language name
		state.language = languageClass[1];
		state.highlightSyntax = true;
	}

	return state;
}