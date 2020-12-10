const getInlineOptions = require('./get-inline-options.js');
const addCSSAndJS = require('./add-CSS-and-JS.js');

let pageContainsCode = false;

module.exports = function(options) {
	// AST = Abstract Syntax Tree from HTML Parser
	return function(AST) {
		const state = {
			isChildOfCode: false,
			isChildOfPre: false,
			language: options.defaultLanguage,
			highlightSyntax: options.highlightSyntax,
			showColors: options.showColors,
			showLanguages: options.showLanguages,
			showLineNumbers: options.showLineNumbers
		}

		AST.forEach(node => {
			walkTree(node, state, options.removeRedundancy);
		})

		if(pageContainsCode) {
			addCSSAndJS(AST, options.styles, options.scripts);
		}

		return AST;
	}
}

function walkTree(node, oldState, removeRedundancy) {
	if(typeof node === 'string') {
		if(oldState.isChildOfCode) {
		/* TODO:
			if inside code:
				add syntax
				add colour preview classes and style attribute
				add line numbers
		*/
		}

		return;
	}

	const newState = Object.assign(oldState, getInlineOptions(node, oldState.isChildOfPre, removeRedundancy));

	if(node.tag === 'code') {
		/* TODO:
			add language class to pre
			add language class
			add line-numbers class
			add data-language attribute
		*/
		pageContainsCode = true;
		newState.isChildOfCode = true;
	}
	else if(node.tag === 'pre') {
		/* TODO:
			add language classes from code children
			add line-numbers class (if code child)
			add data-language attribute
			add first line number
			remove language classes if no code child with language
		*/
		newState.isChildOfPre = node;
	}

	if(node.hasOwnProperty('content')) {
		node.content.forEach(item => {
			walkTree(item, newState, removeRedundancy);
		})
	}
}