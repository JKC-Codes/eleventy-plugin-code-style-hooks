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
		const hasLanguageClass = hasClass && new RegExp(regEx.class, 'i').test(codeElement.attrs.class);

		if(!hasLanguageClass) {
			inheritClass(AST, codeElement)
		}

		// TODO: normalise language name
	});
}

function inheritClass(fullTree, subject) {
	const classSelector = {attrs: {class: new RegExp(regEx.class, 'i')}};
	const nodesWithClass = getNodes(fullTree, fullTree, classSelector);
	let lastMatchingNode;
//TODO skip if no-language found
	// Find the closest ancestor with a language class
	nodesWithClass.forEach(nodeWithClass => {
		fullTree.match.call(nodeWithClass, subject, match => {
			lastMatchingNode = nodeWithClass;
			return match;
		});
	})

	if(lastMatchingNode) {
		const parentClass = lastMatchingNode.attrs.class;
		const languageClass = parentClass.match(new RegExp(regEx.class, 'i'))[0];

		addClass(subject, languageClass);
	}
}

function getNodes(fullTree, tree, selector) {
	let nodes = [];

	fullTree.match.call(tree, selector, matchingNode => {
		nodes.push(matchingNode);
		return matchingNode;
	});
	return nodes;
}

function addClass(node, className) {
	className = className.trim();

	// Ensure keys exist before referencing them
	if(!node.attrs) {
		node.attrs = {class: ''};
	}

	if(node.attrs.class && !node.attrs.class.endsWith(' ')) {
		node.attrs.class += ' ';
	}
	node.attrs.class += className;
}

function addLanguageToPre(AST, preElements) {
	const languageClassRegEx = new RegExp(regEx.class, 'i');

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
					const languageClassRegexGlobal = new RegExp(`${regEx.class}(?: )?`, 'gi');
					preElement.attrs.class = preElement.attrs.class.replace(languageClassRegexGlobal, '');
				}

				addClass(preElement, codeElement.attrs.class.match(languageClassRegEx)[0]);
			}

			return codeElement;
		});
	})
}