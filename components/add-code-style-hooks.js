const getInlineOptions = require('./get-inline-options.js');
const addCSSAndJS = require('./add-CSS-and-JS.js');

let pageContainsCode = false;

module.exports = function(options) {
	// AST = Abstract Syntax Tree from HTML Parser
	return function(AST) {
		const state = {
			isChildOfPre: false,
			isChildOfCode: false,
			language: options.defaultLanguage,
			highlightSyntax: options.highlightSyntax,
			showColors: options.showColors,
			showLanguages: options.showLanguages,
			showLineNumbers: options.showLineNumbers,
		}

		AST.forEach(node => {
			walkTree(node, state);
		})

		if(pageContainsCode) {
			addCSSAndJS(AST, options.styles, options.scripts);
		}

		return AST;
	}
}

function walkTree(node, oldState) {
	if(typeof node === 'string') {
		return;
	}

	const newState = Object.assign(oldState, getInlineOptions(node, options.removeRedundancy));

	if(node.tag === 'pre') {
		newState.isChildOfPre = node;
	}
	else if(node.tag === 'code') {
		pageContainsCode = true;
		newState.isChildOfCode = true;
	}

	if(node.hasOwnProperty('content')) {
		node.content.forEach(item => {
			walkTree(item, newState);
		})
	}
}


/*

Get:
	element code
	element pre with code child(ren)
	element head (or equivalent)

	class lang/language-xxx
	class line-numbers

	attribute data-line-numbers
	attribute data-show-language

	attribute data-highlight-syntax
	attribute data-show-color

Usage:
	element code:
		syntax
		line numbers
		show language
		colour preview
		add css
		add js

	element pre with code child(ren)
		syntax
		line numbers
		show language

	element head (or equivalent)
		add css
		add js

	class language-xxx:
		syntax
		show language

	class line-numbers:
		line numbers

	attribute data-highlight-syntax
		syntax

	attribute data-line-numbers
		line numbers

	attribute data-show-language
		show language

	attribute data-show-color
		colour preview

*/