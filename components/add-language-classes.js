const regEx = require('./regular-expressions.js');

module.exports = function(AST, codeElements, preElements, options) {
	// AST = Abstract Syntax Tree from HTML Parser

	// If no language class, inherit one from closest ancestor
	addLanguageToCode(AST, codeElements, options.removeRedundancy);

	// Inherit language class from direct children Code elements
	addLanguageToPre(preElements, options.removeRedundancy);
}


function addLanguageToCode(AST, codeElements, removeRedundancy) {
	codeElements.forEach(codeElement => {
		const hasClassLanguage = codeElement.attrs && new RegExp(regEx.classLanguage, 'i').test(codeElement.attrs.class);
		const hasAttributePrismIgnore = codeElement.attrs && Object.entries(codeElement.attrs).some(([key, value]) => {
			return /^data-prism$/i.test(key) && /\bignore\b/i.test(value);
		});

		if(!hasClassLanguage && !hasAttributePrismIgnore) {
			inheritClass(AST, codeElement);
		}

		normaliseClass(codeElement, removeRedundancy);
	});
}

function inheritClass(fullTree, subject) {
	let lastMatchingNode;

	// Get all nodes with a language class or data-prism="ignore" attribute
	fullTree.walk(node => {
		const hasClassLanguage = node.attrs && new RegExp(regEx.classLanguage, 'i').test(node.attrs.class);
		const hasAttributePrismIgnore = node.attrs && Object.entries(node.attrs).some(([key, value]) => {
			return /^data-prism$/i.test(key) && /\bignore\b/i.test(value);
		});

		if(hasClassLanguage || hasAttributePrismIgnore) {
			// Find the current code element
			fullTree.match.call(node, subject, match => {
				if(match === subject) {
					lastMatchingNode = node;
				}
				return match;
			});
		}
		return node;
	})

	if(lastMatchingNode) {
		const languageClasses = (lastMatchingNode.attrs.class || '').match(new RegExp(regEx.classLanguage, 'gi'));

		// If it has a language class use it, otherwise it must be data-prism="ignore"
		if(languageClasses) {
			languageClasses.forEach(languageClass => {
				if(!subject.attrs || !subject.attrs.class) {
					subject.attrs = subject.attrs || {};
					subject.attrs.class = languageClass;
				}
				else {
					subject.attrs.class += ' ' + languageClass;
				}
			})
		}
	}
}

function normaliseClass(node, removeRedundancy) {
	if(node.attrs && node.attrs.class) {
		node.attrs.class = node.attrs.class
		.split(' ')
		.reduce((acc, cur) => {
			if(new RegExp(regEx.classLanguage, 'i').test(cur)) {
				const normalisedClass = cur.toLowerCase().replace('lang-', 'language-');
				if(removeRedundancy) {
					return acc.includes(normalisedClass) ? acc : acc.concat(normalisedClass);
				}
				else {
					return acc.concat(normalisedClass);
				}
			}
			else {
				return acc.concat(cur);
			}
		}, [])
		.join(' ');
	}
}

function addLanguageToPre(preElements, removeRedundancy) {
	preElements.forEach(preElement => {
		if(preElement.content) {
			let codeClasses = new Set();

			// Add any language classes from Code direct children to the set
			preElement.content.forEach(node => {
				if(node.tag === 'code' && node.attrs && node.attrs.class) {
					const nodeClasses = node.attrs.class.match(new RegExp(regEx.classLanguage, 'gi'));
					if(nodeClasses) {
						nodeClasses.forEach(nodeClass => {
							codeClasses.add(nodeClass);
						})
					}
				}
			})

			if(codeClasses.size > 0) {
				normaliseClass(preElement, removeRedundancy);
				preElement.attrs = preElement.attrs || {};
				let preClasses = preElement.attrs.class ? preElement.attrs.class.split(' ') : [];

				if(removeRedundancy) {
					// Remove language classes not in any Code children
					preClasses.forEach((preClass, index) => {
						const isLanguageClass = new RegExp(regEx.classLanguage, 'i').test(preClass);

						if(isLanguageClass && !codeClasses.has(preClass)) {
							preClasses.splice(index, 1);
						}
					})
				}

				// Add language classes from Code children if not already there
				codeClasses.forEach(codeClass => {
					if(!preClasses.includes(codeClass)) {
						preClasses.push(codeClass);
					}
				});

				preElement.attrs.class = preClasses.join(' ');
			}
		}
	})
}