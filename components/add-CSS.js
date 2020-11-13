module.exports = function(AST, options) {
	// AST = Abstract Syntax Tree from HTML Parser
	let [head, HTMLNode, index] = getHead(AST);

	options.styles.forEach(style => {
		if(head) {
			head.content ? head.content.push(style) : head.content = [style];
		}
		else {
			const content = HTMLNode ? HTMLNode.content : AST;
			content.splice(index, 0, style);
			index++
		}
	});
}

function getHead(tree, HTMLNode) {
	const validHeadTags = ['title', 'link', 'meta', 'style', 'script', 'noscript', 'base'];

	for(let i = 0; i < tree.length; i++) {
		// Has head tag
		if(tree[i].tag === 'head') {
			return [tree[i], null, null];
		}
		// Head tag must be a child of HTML
		else if(tree[i].tag === 'html') {
			return getHead(tree[i].content, tree[i]);
		}
		// <!doctype html>, spacing character, or no head tag but is valid inside head
		else if(!tree[i].tag || validHeadTags.includes(tree[i].tag)) {
			continue;
		}
		// No head tag and not an element that is valid inside head
		else {
			return [null, HTMLNode, i];
		}
	}
}