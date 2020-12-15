const getInlineOptions = require('./get-inline-options.js');
const addHeadElements = require('./add-head-elements.js');
const addClass = require('./add-class.js');
const addAttribute = require('./add-attribute.js');
const addLineHooks = require('./add-line-hooks.js');
const regEx = require('./regular-expressions.js');

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
			walkTree(node, AST, state, options.removeRedundancy);
		})

		if(pageContainsCode) {
			addHeadElements(AST, options.styles, options.scripts);
		}

		return AST;
	}
}

function walkTree(node, parentNode, parentState, removeRedundancy) {
	// Update state and remove redundant classes/attributes
	const state = Object.assign(
		{},
		parentState,
		getInlineOptions(node, parentState.isChildOfPre, removeRedundancy)
	);

	if(node.tag === 'pre') {
		state.isChildOfPre = node;
	}
	else if(node.tag === 'code') {
		pageContainsCode = true;
		state.isChildOfCode = true;
	}


	/*
		Add Classes
	*/
	// language-xxx class
	if(node.tag === 'code' && state.highlightSyntax && state.language) {
		addClass(node, `language-${state.language.toLowerCase()}`);

		if(state.isChildOfPre) {
			addClass(state.isChildOfPre, `language-${state.language.toLowerCase()}`);
		}
	}

	// line-numbers class
	if(node.tag === 'code' && state.isChildOfPre && state.showLineNumbers) {
		addClass(node, 'line-numbers')
		addClass(state.isChildOfPre, 'line-numbers')
	}

	/*
		Add Attributes
	*/
	// data-language="xxx" attribute
	if(node.tag === 'code' && state.showLanguages && state.language) {
		addAttribute(node, 'data-language', state.language);

		if(state.isChildOfPre) {
			addAttribute(state.isChildOfPre, 'data-language', state.language);
		}
	}

	/*
		Add Line Hooks
	*/
	if(state.showLineNumbers) {
		if(node.tag === 'pre') {
			state.lastNewLine = {
				content: node.content,
				stringIndex: null,
				state: state
			};
		}
		else if(state.isChildOfPre) {
			if(node.tag === 'code' && !parentState.isChildOfCode && state.lastNewLine.stringIndex !== 'code') {
				// replace last new line with span
				addLineHooks(state.lastNewLine.content, state.lastNewLine.stringIndex, false, state.lastNewLine.state);
				state.lastNewLine.stringIndex = 'code';
			}
			else if(new RegExp(regEx.lineNew).test(node)) {
				if(state.isChildOfCode) {
					// replace each new line with span
					addLineHooks(parentNode.content, parentState.currentIndex, true, parentState);
				}
				else {
					// note each new line outside of code
					state.lastNewLine.content = parentNode.content;
					state.lastNewLine.stringIndex = state.currentIndex;
					state.lastNewLine.state = parentState;
				}
			}
		}
	}

	/*
		Add Colour Preview Classes and Style Attribute
	*/
	// TODO

	/*
		Add Syntax
	*/
	// TODO


	if(node.hasOwnProperty('content')) {
		state.currentIndex = 0;
		while(state.currentIndex < node.content.length) {
			walkTree(node.content[state.currentIndex], node, state, removeRedundancy);
			state.currentIndex++;
		}
	}
}