const getInlineOptions = require('./get-inline-options.js');
const addHeadElements = require('./add-head-elements.js');
const addClass = require('./add-class.js');
const addAttribute = require('./add-attribute.js');

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
			addHeadElements(AST, options.styles, options.scripts);
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

	// Update state and remove redundant classes/attributes
	const newState = Object.assign({}, oldState, getInlineOptions(node, oldState.isChildOfPre, removeRedundancy));

	if(node.tag === 'code') {
		pageContainsCode = true;
		newState.isChildOfCode = true;
	}
	else if(node.tag === 'pre') {
		newState.isChildOfPre = node;
	}

	// Walk children before updating node so Pre can inherit correct Code classes/attributes
	if(node.hasOwnProperty('content')) {
		node.content.forEach(item => {
			walkTree(item, newState, removeRedundancy);
		})
	}

	if(node.tag === 'code') {
		if(newState.highlightSyntax && newState.language) {
			addClass(node, `language-${newState.language.toLowerCase()}`);

			if(newState.isChildOfPre) {
				addClass(newState.isChildOfPre, `language-${newState.language.toLowerCase()}`);
			}

			if(newState.showLanguages) {
				addAttribute(node, 'data-language', newState.language);
				if(newState.isChildOfPre) {
					addAttribute(newState.isChildOfPre, 'data-language', newState.language);
				}
			}
		}

		if(newState.isChildOfPre && newState.showLineNumbers) {
			addClass(node, 'line-numbers')
			addClass(newState.isChildOfPre, 'line-numbers')
		}
	}
	else if(node.tag === 'pre') {
		/* TODO:
			add first line number
		*/
	}
}