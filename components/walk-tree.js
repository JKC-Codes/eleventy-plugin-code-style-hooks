const {default: parseHTML} = require('posthtml-parser');
const updateState = require('./update-state.js');
const updateAttributes = require('./update-attributes.js');
const addFirstLineNumbers = require('./add-first-line-numbers.js');
const addHooks = require('./add-hooks.js');
const addHeadElements = require('./add-head-elements.js');
const regEx = require('./regular-expressions.js');

let pageContainsCode;
let prismAPI;
let removeRedundancy;
let usingPostHTML;

module.exports = function(options) {
	pageContainsCode = false;
	prismAPI = options.prism;
	removeRedundancy = options.removeRedundancy;
	usingPostHTML = options.usingPostHTML;

	// AST = Abstract Syntax Tree from HTML Parser
	return function(AST) {
		const state = {
			isChildOfCode: false,
			isChildOfPre: false,
			index: 0,
			language: options.defaultLanguage,
			highlightSyntax: options.highlightSyntax,
			colorPreviews: options.colorPreviews,
			languageLabels: options.languageLabels,
			lineNumbers: options.lineNumbers
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

		// Note each new line within pre but outside of code so the first line number can be added
		if(state.isChildOfPre && !state.isChildOfCode && state.lineNumbers && hasNewLine) {
			state.needsFirstLine.status = true;
		}

		if(state.isChildOfCode && ((state.highlightSyntax && state.language) || state.lineNumbers)) {
			let newNode = addHooks(node, state, prismAPI);

			if(usingPostHTML) {
				// Convert strings with HTML to an AST so other PostHTML plugins can work on them
				newNode = parseHTML(newNode);
				// Add the updated string to the syntax tree
				parentNode.content.splice(parentState.index, 1, ...newNode);
				// Update index to prevent infinite loops
				parentState.index += newNode.length - 1;
			}
			else {
				// Add the updated string to the syntax tree
				parentNode.content.splice(parentState.index, 1, newNode);
			}
		}
	}
	else {
		if(node.tag && node.tag.toLowerCase() === 'code') {
			pageContainsCode = true;

			if(state.isChildOfPre && !state.isChildOfCode && state.lineNumbers && state.needsFirstLine.status) {
				addFirstLineNumbers(node, state);
			}
		}
		else if(node.tag && node.tag.toLowerCase() === 'pre' && state.lineNumbers) {
			state.needsFirstLine = {status: true};
		}

		// Delay Pre so Code children languages can be added
		if(node.tag && node.tag.toLowerCase() !== 'pre') {
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
		if(node.tag && node.tag.toLowerCase() === 'pre') {
			updateAttributes(node, state, removeRedundancy);
		}
	}
}