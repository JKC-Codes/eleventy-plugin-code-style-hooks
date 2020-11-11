const regEx = require('./regular-expressions.js');

module.exports = function(AST, codeElements, options) {
	// AST = Abstract Syntax Tree from HTML Parser
	const needsCSS = codeElements.some(node => {
		return node.attrs && new RegExp(regEx.classLanguage).test(node.attrs.class);
	});

	if(options.styles && needsCSS) {
		// TODO there's no need to traverse the entire tree here, the only options are:
		// 1. html followed by head
		// 2. html with no head
		// 3. head with no html
		// 4. no html or head
		/*
		Elements that can be used inside <head>:

    <title>
    <base>
    <link>
    <style>
    <meta>
    <script>
    <noscript>
    <template>
		*/
		AST.match({tag: 'head'}, head => {
			if(!head.content) {
				head.content = [];
			}

			options.styles.forEach(style => {
				head.content.push(style);
			});

			return head;
		});
	}
}