const regEx = require('./regular-expressions.js');

module.exports = function(AST, codeElements, preElements) {
	// AST = Abstract Syntax Tree from HTML Parser

	// If no language class, inherit one from closest ancestor
	addLanguageToCode(AST, codeElements);

	// Inherit language class from direct children Code elements
	addLanguageToPre(preElements);
}


function addLanguageToCode(AST, codeElements) {
	codeElements.forEach(codeElement => {
		const hasClass = codeElement.attrs && codeElement.attrs.class;
		const hasClassLanguage = hasClass && new RegExp(regEx.classLanguage, 'i').test(codeElement.attrs.class);
		const hasClassNoLanguage = hasClass && new RegExp(regEx.classExclude, 'i').test(codeElement.attrs.class);

		if(!hasClassLanguage && !hasClassNoLanguage) {
			inheritClass(AST, codeElement);
		}

		normaliseClass(codeElement);
	});
}

function inheritClass(fullTree, subject) {
	const classLanguage = {attrs: {class: new RegExp(regEx.classLanguage, 'i')}};
	const classNoLanguage = {attrs: {class: new RegExp(regEx.classExclude, 'i')}};
	let lastMatchingNode;

	// Get all nodes with a language/no-language class
	fullTree.match([classLanguage, classNoLanguage], nodeWithLanguage => {
		// Find the closest ancestor with a language/no-language class
		fullTree.match.call(nodeWithLanguage, subject, match => {
			if(match === subject) {
				lastMatchingNode = nodeWithLanguage;
			}
			return match;
		});
		return nodeWithLanguage;
	})

	if(lastMatchingNode) {
		const ancestorClass = lastMatchingNode.attrs.class;
		const languageClasses = ancestorClass.match(new RegExp(regEx.classLanguage, 'gi'));

		// If it has a language class use it, otherwise it must be no-language so ignore
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

function normaliseClass(node) {
	if(node.attrs && node.attrs.class) {
		node.attrs.class = node.attrs.class
		.split(' ')
		.reduce((acc, cur) => {
			if(new RegExp(regEx.classLanguage, 'i').test(cur)) {
				const normalisedClass = cur.toLowerCase().replace('lang-', 'language-');
				return acc.includes(normalisedClass) ? acc : acc.concat(normalisedClass);
			}
			else {
				return acc.concat(cur);
			}
		}, [])
		.join(' ');
	}
}

function addLanguageToPre(preElements) {
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
				normaliseClass(preElement);
				preElement.attrs = preElement.attrs || {};
				let preClasses = preElement.attrs.class ? preElement.attrs.class.split(' ') : [];

				// Remove language classes not in any Code children
				preClasses.forEach((preClass, index) => {
					const isLanguageClass = new RegExp(regEx.classLanguage, 'i').test(preClass);

					if(isLanguageClass && !codeClasses.has(preClass)) {
						preClasses.splice(index, 1);
					}
				})

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