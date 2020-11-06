// TODO: pass in CSS option

const regEx = require('./regular-expressions.js');

module.exports = function(AST, codeElements) {
	// AST = Abstract Syntax Tree from HTML Parser
	const needsCSS = codeElements.some(node => {
		return node.attrs && new RegExp(regEx.classLanguage).test(node.attrs.class);
	});

	if(needsCSS) {
		AST.match({tag: 'head'}, head => {
			if(!head.content) {
				head.content = [];
			}

			head.content.push({
				tag: 'link',
				attrs: {
					rel: 'stylesheet',
					href: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/themes/prism-coy.min.css'
				},
			});

			return head;
		});
	}
}