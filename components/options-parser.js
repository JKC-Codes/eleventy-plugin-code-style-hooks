module.exports = function(userOptions) {
	const parsedOptions= {};

	for(const key in userOptions) {
		switch(key) {
			case 'defaultLanguage': Object.assign(parsedOptions, validateLanguage(key, userOptions[key]));
			break;

			case 'highlightSyntax':
			case 'removeRedundancy':
			case 'showColors':
			case 'showLanguages':
			case 'showLineNumbers':
				Object.assign(parsedOptions, validateBoolean(key, userOptions[key]));
			break;

			case 'scripts':
			case 'styles':
				try {
					Object.assign(parsedOptions, validateScriptOrStyle(key, userOptions[key]));
				}
				catch(error) {
					throw new Error(`Code Style Hooks plugin requires the ${key} option to be a single String or Object, or an array of Strings or Objects. Received ${error.type}: ${error.text}`);
				}
			break;

			default: throw new Error(`Code Style Hooks plugin received an unrecognised option: ${key}`);
		}
	}

	return parsedOptions;
}

function validateLanguage(key, value) {
	if(value === undefined || value === null) {
		return {};
	}
	else if(typeof value !== 'string') {
		throw new Error(`Code Style Hooks plugin requires the ${key} option to be a String. Received ${typeof value}: ${JSON.stringify(value)}`);
	}
	else {
		const parsedLanguage = {};
		parsedLanguage[key] = value.toLowerCase();

		return parsedLanguage;
	}
}

function validateBoolean(key, value) {
	if(value === undefined || value === null) {
		return {};
	}
	else if(typeof value !== 'boolean') {
		throw new Error(`Code Style Hooks plugin requires the ${key} option to be a Boolean. Received ${typeof value}: ${JSON.stringify(value)}`);
	}
	else {
		const parsedBoolean = {};
		parsedBoolean[key] = value;

		return parsedBoolean;
	}
}

function validateScriptOrStyle(key, value) {
	let elements = [];

	function addElement(headItem) {
		const element = {
			tag: key === 'scripts' ? 'script' : 'link',
			attrs: {}
		};

		if(key === 'styles') {
			element.attrs.rel = 'stylesheet';
		}

		if(typeof headItem === 'string') {
			if(key === 'scripts') {
				element.attrs.src = headItem;
			}
			else if(key === 'styles') {
				element.attrs.href = headItem;
			}
		}
		else if(typeof headItem === 'object' && !Array.isArray(headItem)) {
			element.attrs = Object.assign(element.attrs, headItem);
		}
		else {
			throw {
				type: typeof headItem,
				text: JSON.stringify(headItem)
			};
		}

		elements.push(element);
	}

	if(value === undefined || value === null) {
		return {};
	}
	else if(Array.isArray(value)) {
		value.forEach(valueItem => {
			addElement(valueItem)
		});
	}
	else {
		addElement(value)
	}

	const parsedScriptOrStyle = {};
	parsedScriptOrStyle[key] = elements;

	return parsedScriptOrStyle;
}