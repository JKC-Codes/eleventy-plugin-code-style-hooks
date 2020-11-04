/*
	Change lang to language on pre and code only
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

	// Inherit language class from direct child Code elements
	addLanguageToPre(AST, preElements);

	return AST;
}


function addLanguageToCode(AST, codeElements) {
	codeElements.forEach(codeElement => {
		const hasClass = codeElement.attrs && codeElement.attrs.class;
		const hasLanguageClass = hasClass && new RegExp(regEx.class).test(codeElement.attrs.class);

		if(!hasLanguageClass) {
			inheritClass(AST, codeElement);
		}

		normaliseClass(codeElement);
	});
}

function inheritClass(fullTree, subject) {
	const classSelector = {attrs: {class: new RegExp(regEx.class)}};
	let lastMatchingNode;

	// Get all nodes with a language class
	fullTree.match(classSelector, matchingNode => {
		// Find the closest ancestor with a language class
		fullTree.match.call(matchingNode, subject, match => {
			lastMatchingNode = matchingNode;
			return match;
		});
		return matchingNode;
	})

//TODO skip if no-language found

	if(lastMatchingNode) {
		const parentClass = lastMatchingNode.attrs.class;
		const languageClass = parentClass.match(new RegExp(regEx.class))[0];

		addClass(subject, languageClass);
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
		let firstMatch = true;

		classes.forEach(function(className, index) {
			if(new RegExp(regEx.class).test(className)) {
				// Only normalise first lang(uage)-xxx class
				if(firstMatch) {
					firstMatch = false;
					classes[index] = classes[index].toLowerCase().replace('lang-', 'language-');
				}
				else {
					// Remove additional language classes
					classes.splice(index, 1);
				}
			}
		});

		node.attrs.class = classes.join(' ');
	}
}

function addLanguageToPre(AST, preElements) {
	const languageClassRegEx = new RegExp(regEx.class);

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
					const languageClassRegexGlobal = new RegExp(`${regEx.class}(?: )?`, 'g');
					preElement.attrs.class = preElement.attrs.class.replace(languageClassRegexGlobal, '');
				}

				addClass(preElement, codeElement.attrs.class.match(languageClassRegEx)[0]);
			}

			return codeElement;
		});
	})
}