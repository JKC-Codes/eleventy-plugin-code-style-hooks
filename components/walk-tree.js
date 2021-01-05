const parseHTML = require('posthtml-parser');
const updateState = require('./update-state.js');
const updateAttributes = require('./update-attributes.js');
const addFirstLineNumbers = require('./add-first-line-numbers.js');
const addLineHooks = require('./add-line-hooks.js');
const addColorHooks = require('./add-color-hooks.js');
const addSyntaxHooks = require('./add-syntax-hooks.js');
const addHeadElements = require('./add-head-elements.js');
const regEx = require('./regular-expressions.js');

let usingPostHTML;
let removeRedundancy;
let pageContainsCode = false;

module.exports = function(options) {
	usingPostHTML = options.usingPostHTML;
	removeRedundancy = options.removeRedundancy;
	// AST = Abstract Syntax Tree from HTML Parser
	return function(AST) {
		const state = {
			isChildOfCode: false,
			isChildOfPre: false,
			index: 0,
			language: options.defaultLanguage,
			highlightSyntax: options.highlightSyntax,
			showColors: options.showColors,
			showLanguages: options.showLanguages,
			showLineNumbers: options.showLineNumbers
		}

		AST.forEach(node => {
			walkTree(node, AST, state);
		})

		if(pageContainsCode) {
			addHeadElements(AST, options.styles, options.scripts);
		}

		return AST;
	}
}


function walkTree(node, parentNode, parentState) {
	const state = updateState(node.attrs, parentNode, parentState);

	if(typeof node === 'string') {
		const hasNewLine = new RegExp(regEx.lineNew).test(node);

		if(state.isChildOfPre && !state.isChildOfCode && state.showLineNumbers && hasNewLine) {
			state.lastNewLine.node = parentNode;
			state.lastNewLine.index = state.index;
			state.lastNewLine.state = parentState;
		}

		if(state.isChildOfCode) {
			if(state.showLineNumbers) {
				addLineHooks(parentNode.content, parentState.index);
			}

			if(state.showColors) {
				addColorHooks(parentNode.content, parentState.index);
			}

			if(state.highlightSyntax && state.language) {
				addSyntaxHooks(parentNode.content, parentState, state.language.toLowerCase(), usingPostHTML);
			}

			// Convert strings with HTML to an AST so other PostHTML plugins can work
			let newNode = parentNode.content[parentState.index]

			if(usingPostHTML && typeof newNode === 'string') {
				newNode = parseHTML(newNode);
				parentNode.content.splice(parentState.index, 1, ...newNode);
				// Update index to prevent infinite loops
				parentState.index += newNode.length - 1;
			};
		}
	}
	else {
		if(node.tag === 'code') {
			pageContainsCode = true;

			if(state.isChildOfPre && !state.isChildOfCode && state.showLineNumbers) {
				addFirstLineNumbers(state.lastNewLine);
			}
		}
		else if(node.tag === 'pre' && state.showLineNumbers) {
			state.lastNewLine = {
				node: node,
				index: null,
				state: state
			}
		}

		// Delay Pre so Code children languages can be added
		if(node.tag !== 'pre') {
			updateAttributes(node, state, removeRedundancy);
		}

		if(node.hasOwnProperty('content')) {
			state.index = 0;
			while(state.index < node.content.length) {
				walkTree(node.content[state.index], node, state);
				state.index++;
			}
		}

		// Update attributes after walking children so Code languages can be added
		if(node.tag === 'pre') {
			updateAttributes(node, state, removeRedundancy);
		}
	}
}