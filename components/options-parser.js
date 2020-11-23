module.exports = function(options) {
	if(options.hasOwnProperty('removeRedundancy')) {
		parseRedundancy(options);
	}

	if(options.hasOwnProperty('styles')) {
		options.styles = parseStyles(options.styles);
	}

	return options;
}

function parseRedundancy(options) {
	if(typeof options.removeRedundancy !== 'boolean') {
		if(options.removeRedundancy !== undefined && options.removeRedundancy !== null) {
			console.warn(`Code Styling Hooks plugin ignored removeRedundancy option: ${options.removeRedundancy}`);
		}
		delete options.removeRedundancy;
	}
}

function parseStyles(styles) {
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
		else {
			linkElement.attrs = Object.assign(linkElement.attrs, style);
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

	return linkElements;
}