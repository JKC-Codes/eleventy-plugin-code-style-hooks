module.exports = function(userOptions = {}) {
	const parsedOptions= {};

	for(const [key, value] of Object.entries(userOptions)) {
		if(value === undefined || value === null) {
			continue;
		}

		switch(key) {
			case 'defaultLanguage': Object.assign(parsedOptions, validateLanguage(key, value));
			break;

			case 'highlightSyntax':
			case 'markdownTrimTrailingNewline':
			case 'removeRedundancy':
			case 'showColors':
			case 'showLanguages':
			case 'showLineNumbers':
				Object.assign(parsedOptions, validateBoolean(key, value));
			break;

			case 'scripts':
			case 'styles':
				try {
					Object.assign(parsedOptions, validateScriptOrStyle(key, value));
				}
				catch(error) {
					throw new Error(`Code Style Hooks plugin requires the ${key} option to be a single String or Object, or an array of Strings or Objects. Received ${error.type}: ${error.text}`);
				}
			break;

			case 'prism': Object.assign(parsedOptions, validatePrismAPI(key, value));
			break;

			default: throw new Error(`Code Style Hooks plugin received an unrecognised option: ${key}`);
		}
	}

	return parsedOptions;
}

function validateLanguage(key, value) {
	if(typeof value !== 'string') {
		throw new Error(`Code Style Hooks plugin requires the ${key} option to be a String. Received ${typeof value}: ${JSON.stringify(value)}`);
	}
	else {
		return {[key]: value.trim().toLowerCase()};
	}
}

function validateBoolean(key, value) {
	if(typeof value !== 'boolean') {
		throw new Error(`Code Style Hooks plugin requires the ${key} option to be a Boolean. Received ${typeof value}: ${JSON.stringify(value)}`);
	}
	else {
		return {[key]: value};
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
			Object.assign(element.attrs, headItem);
		}
		else {
			throw {
				type: typeof headItem,
				text: JSON.stringify(headItem)
			};
		}

		elements.push(element);
	}

	if(Array.isArray(value)) {
		value.forEach(valueItem => {
			addElement(valueItem)
		});
	}
	else {
		addElement(value)
	}

	return {[key]: elements};
}

function validatePrismAPI(key, value) {
	if(typeof value !== 'function') {
		throw new Error(`Code Style Hooks plugin requires the ${key} option to be a Function. Received ${typeof value}: ${JSON.stringify(value)}`);
	}
	else {
		return {[key]: value};
	}
}