const regEx = require('./regular-expressions.js');

module.exports = function(node, isChildOfPre, removeRedundancy) {
	const options = {};

	if(node.attrs) {
		Object.assign(options, getDataAttributes(node.attrs, removeRedundancy));
		if(node.attrs.class) {
			Object.assign(options, getClasses(node, isChildOfPre, removeRedundancy));
		}
	}

	for(key in options) {
		if(options[key] === undefined) {
			delete options[key];
		}
	}

	return options;
}


function getDataAttributes(attributes, removeRedundancy) {
	let highlightSyntax;
	let	showColors;
	let	showLanguages;
	let	showLineNumbers;

	for(let key of Object.keys(attributes)) {
		if(new RegExp(regEx.attributeData, 'i').test(key)) {
			// If value is 'true' or omitted return true
			const value = attributes[key].toLowerCase() === 'false' ? false : true;

			switch(key.toLowerCase()) {
				case 'data-highlight-syntax': highlightSyntax = value;
				break;
				case 'data-show-color': showColors = value;
				break;
				case 'data-show-language': showLanguages = value;
				break;
				case 'data-line-numbers': showLineNumbers = value;
				break;
			}

			if(removeRedundancy) {
				delete attributes[key];
			}
		}
	}

	return {
		highlightSyntax,
		showColors,
		showLanguages,
		showLineNumbers
	};
}

function getClasses(node, isChildOfPre, removeRedundancy) {
	const classes = node.attrs.class.split(' ');
	let language;
	let showLineNumbers;

	for(let i = 0; i < classes.length; i++) {
		if(new RegExp(regEx.classLanguage, 'i').test(classes[i])) {
			// If first 'lang-xxx'/'language-xxx' class
			if(!language) {
				// Use capture group for the language name to use in data-language attribute later
				language = classes[i].match(new RegExp(regEx.classLanguage, 'i'))[1];

				if(node.tag === 'code') {
					// Update existing class with normalised class
					classes[i] = classes[i].toLowerCase().replace('lang-', 'language-');
					// No need to check  for redundancy
					continue;
				}
			}

			if(removeRedundancy) {
				classes.splice(i, 1);
				i--;
			}
		}
		else if(new RegExp(regEx.classLineNumbers, 'i').test(classes[i])) {
			// If first 'line-numbers' class
			if(showLineNumbers !== true) {
				showLineNumbers = true;

				if((node.tag === 'code' && isChildOfPre) || node.tag === 'pre') {
					classes[i] = classes[i].toLowerCase();
					// Don't remove the class as it's not redundant
					continue;
				}
			}

			if(removeRedundancy) {
				classes.splice(i, 1);
				i--;
			}
		}
	}

	// Prevent class="" attribute
	if(classes.length > 0) {
		node.attrs.class = classes.join(' ');
	}
	else {
		delete node.attrs.class;
	}

	return {
		language,
		showLineNumbers
	}
}