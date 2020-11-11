module.exports = function(options) {
	if(options.styles) {
		options.styles = parseStyles(options.styles);
	}
	return options;
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