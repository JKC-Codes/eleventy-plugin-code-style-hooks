const regEx = require('./regular-expressions.js');

module.exports = function(attributes, parentNode, parentState) {
	const dataAttributes = attributes ? getDataAttributes(attributes) : {};
	const classes = attributes && attributes.class ? getClasses(attributes.class) : {};
	const state = Object.assign({}, parentState, dataAttributes, classes);

	if(parentNode.tag === 'pre') {
		state.isChildOfPre = parentNode;
	}
	else if(parentNode.tag === 'code') {
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
				case 'data-show-color': state.showColors = value;
				break;
				case 'data-show-language': state.showLanguages = value;
				break;
				case 'data-line-numbers': state.showLineNumbers = value;
				break;
			}
		}
	}

	return state;
}

function getClasses(classesString) {
	const state = {};
	const languageClass = classesString.match(new RegExp(regEx.classLanguage, 'i'));

	if(languageClass) {
		// [1] = capture group with the language name
		state.language = languageClass[1];
		state.highlightSyntax = true;
	}

	return state;
}