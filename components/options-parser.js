module.exports = function(options) {
	if(options.hasOwnProperty('removeRedundancy')) {
		validateRedundancy(options);
	}

	if(options.hasOwnProperty('styles')) {
		try {
			parseStyles(options);
		}
		catch(error) {
			throw new Error(`Code Style Hooks plugin requires the styles option to be a single String or Object, or an array of Strings or Objects. Received ${error.type}: ${error.text}`);
		}
	}

	return options;
}

function validateRedundancy(options) {
	if(typeof options.removeRedundancy !== 'boolean') {
		if(options.removeRedundancy !== undefined && options.removeRedundancy !== null) {
			console.warn(`Code Style Hooks plugin requires the removeRedundancy option to be a Boolean. Received ${typeof options.removeRedundancy}: ${options.removeRedundancy}`);
		}
		delete options.removeRedundancy;
	}
}

function parseStyles(options) {
	if(options.styles === undefined || options.styles === null) {
		delete options.styles;
		return;
	}

	const styles = options.styles;
	let linkElements = [];

	function addLinkElement(style) {
		const linkElement = {
			tag: 'link',
			attrs: {
				rel: 'stylesheet'
			}
		};

		if(typeof style === 'string') {
			linkElement.attrs.href = style;
		}
		else if(typeof style === 'object' && !Array.isArray(style)) {
			linkElement.attrs = Object.assign(linkElement.attrs, style);
		}
		else {
			throw {
				type: typeof style,
				text: style
			};
		}

		linkElements.push(linkElement);
	}

	if(Array.isArray(styles)) {
		styles.forEach(style => {
			addLinkElement(style)
		});
	}
	else {
		addLinkElement(styles)
	}

	options.styles = linkElements;
}