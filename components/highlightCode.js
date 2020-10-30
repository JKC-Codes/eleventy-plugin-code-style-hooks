const regEx = require('./regular-expressions.js');
const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

module.exports = function(options) {
	// AST = Abstract Syntax Tree from HTML Parser
	return function(AST) {

		addLanguageToCode(AST);

		return AST;
	}
}

function addLanguageToCode(AST) {
	const codeElements = getNodes(AST, AST, {tag: 'code'});
	const languageClassRegEx = new RegExp(regEx.class.language.className, 'i');
	const languageClassSelector = {attrs: {class: languageClassRegEx}};

	codeElements.forEach(codeElement => {
		const hasClassAttribute = codeElement.attrs && codeElement.attrs.class;
		const hasLanguageClass = hasClassAttribute && languageClassRegEx.test(codeElement.attrs.class);

		if(!hasLanguageClass) {
			inheritClass(AST, codeElement, languageClassSelector)
		}
	});
}

function getNodes(fullTree, tree, selector) {
	let nodes = [];

	fullTree.match.call(tree, selector, function(matchingNode) {
		nodes.push(matchingNode);
		return matchingNode;
	});
	return nodes;
}

function inheritClass(fullTree, subject, selector) {
	const nodesWithClass = getNodes(fullTree, fullTree, selector);
	let lastMatchingNode;

	for(node of nodesWithClass) {
		fullTree.match.call(node, subject, match => {
			lastMatchingNode = node;
			return match;
		});
	}

	if(lastMatchingNode) {
		const parentClass = lastMatchingNode.attrs.class;
		const languageClassRegEx = new RegExp(regEx.class.language.className, 'i');
		const className = parentClass.match(languageClassRegEx)[0];

		addClass(subject, className);
	}
}

function addClass(node, className) {
	if(!node.attrs) {
		node.attrs = {};
	}

	if(!node.attrs.class) {
		node.attrs.class = '';
	}

	// Regex = start of line or whitespace + classname + end of line or whitespace
	const classRegex = new RegExp(/(?:^|\s)${className}(?:$|\s)/, 'i');
	const hasClass = classRegex.test(node.attrs.class);

	if(!hasClass) {
		if(node.attrs.class === '' || node.attrs.class.endsWith(' ')) {
			node.attrs.class += className;
		}
		else {
			node.attrs.class += ' ' + className;
		}
	}
}









/*

Code inherits language from ancestors' language-xxx class

If code is a direct child of pre: add language-xxx class to pre (override existing language class)


If language-none class on code: don't highlight

Run prism on code

*/











// const Prism = require('prismjs');
// const render = require('posthtml-render');
// const loadLanguages = require('prismjs/components/');

// function createPrismPlugin(options) {
//   return function (tree) {
//     const highlightCodeTags = node => tree.match.call(node, {tag: 'code'}, highlightNode);

//     if (options.inline) {
//       highlightCodeTags(tree);
//     } else {
//       tree.match({tag: 'pre'}, highlightCodeTags);
//     }
//   };
// }

// function highlightNode(node) {
//   const attrs = node.attrs || {};
//   const classList = `${attrs.class || ''}`.trimStart();

//   if ('prism-ignore' in attrs) {
//     delete node.attrs['prism-ignore'];
//     return node;
//   }

//   if (classList.includes('prism-ignore')) {
//     node.attrs.class = node.attrs.class.replace('prism-ignore', '').trim();
//     return node;
//   }

//   const lang = getExplicitLanguage(classList);

//   if (lang && !classList.includes(`language-${lang}`)) {
//     attrs.class = `${classList || ''} language-${lang}`.trimStart();
//   }

//   node.attrs = attrs;

//   if (node.content) {
//     let html = '';

//     if (node.content[0].tag && !node.content[0].content) {
//       html = `<${node.content[0].tag}>`;
//     } else {
//       html = render(node.content);
//     }

//     node.content = mapStringOrNode(html, lang);
//   }

//   return node;
// }

// function mapStringOrNode(stringOrNode, lang = null) {
//   if (typeof stringOrNode === 'string') {
//     if (lang) {
//       if (!Object.keys(Prism.languages).includes(lang)) {
//         loadLanguages.silent = true;
//         loadLanguages([lang]);
//       }

//       return Prism.highlight(stringOrNode, Prism.languages[lang], lang);
//     }

//     return Prism.highlight(stringOrNode, Prism.languages.markup, 'markup');
//   }

//   highlightNode(stringOrNode);
//   return stringOrNode;
// }

// function getExplicitLanguage(classList) {
//   const matches = classList.match(/(?:lang|language)-(\w*)/);
//   return matches === null ? null : matches[1];
// }

// module.exports = options => {
//   options = options || {};
//   options.inline = options.inline || false;

//   return function (tree) {
//     return createPrismPlugin(options)(tree);
//   };
// };