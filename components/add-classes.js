/*
	Change lang to language on pre and code only
	code keeps languages, pre doesn't
	Code inherits class from closest ancestor if no language
		Don't inherit if no-language on Code or ancestor
	Pre inherits class from code and overwrites
		Only add class to pre if direct parent
*/

const regEx = require('./regular-expressions.js');

module.exports = function(AST, codeElements, preElements) {
	// AST = Abstract Syntax Tree from HTML Parser

	// If no language class, inherit one from closest ancestor
	addLanguageToCode(AST, codeElements);

	// Inherit language class from direct children Code elements
	addLanguageToPre(AST, preElements);

	return AST;
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
				addClass(subject, languageClass);
			})
		}
	}
}

function addClass(node, className) {
	if(!node.attrs || !node.attrs.class) {
		node.attrs = node.attrs || {};
		node.attrs.class = className;
	}
	else {
		node.attrs.class += ' ' + className;
	}
}

function normaliseClass(node) {
	if(node.attrs && node.attrs.class) {
		let classes = node.attrs.class.split(' ');

		classes.forEach(function(className, index) {
			if(new RegExp(regEx.classLanguage, 'i').test(className)) {
				classes[index] = classes[index].toLowerCase().replace('lang-', 'language-');
			}
		});

		node.attrs.class = classes.join(' ');
	}
}

function addLanguageToPre(AST, preElements) {
	const languageClassRegEx = new RegExp(regEx.classLanguage, 'i');

	preElements.forEach(preElement => {
		const preHasClassAttribute = preElement.attrs && preElement.attrs.class;
		const preHasLanguageClass = preHasClassAttribute && languageClassRegEx.test(preElement.attrs.class);

		AST.match.call(preElement, {tag: 'code'}, codeElement => {
			const codeHasClassAttribute = codeElement.attrs && codeElement.attrs.class;
			const codeHasLanguageClass = codeHasClassAttribute && languageClassRegEx.test(codeElement.attrs.class);

			if(codeHasLanguageClass) {
				if(preHasLanguageClass) {
					// Mimic Prism removing existing language class(es)
					// Regex = language class + optional whitespace
					const languageClassRegexGlobal = new RegExp(`${regEx.classLanguage}(?: )?`, 'gi');
					preElement.attrs.class = preElement.attrs.class.replace(languageClassRegexGlobal, '');
				}

				addClass(preElement, codeElement.attrs.class.match(languageClassRegEx)[0]);
			}

			return codeElement;
		});
	})
}