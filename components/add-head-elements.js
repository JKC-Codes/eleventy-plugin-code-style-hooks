module.exports = function(AST, styles, scripts) {
	// AST = Abstract Syntax Tree from HTML Parser
	let {head, HTMLNode, index} = getHead(AST);
	const elements = styles.concat(scripts);

	elements.forEach(element => {
		// Add style/script as last/only element of Head
		if(head) {
			head.content ? head.content.push(element) : head.content = [element];
		}
		// Add style/script as first child of HTML, or document if HTML element doesn't exist
		else {
			const content = HTMLNode ? HTMLNode.content : AST;
			content.splice(index, 0, element);
			index++
		}
	});
}

function getHead(tree, HTMLNode) {
	const validHeadTags = ['title', 'link', 'meta', 'style', 'script', 'noscript', 'base'];

	for(let i = 0; i < tree.length; i++) {
		if(tree[i].tag && tree[i].tag.toLowerCase() === 'head') {
			return {head: tree[i]};
		}
		// Head tag must be a child of HTML
		else if(tree[i].tag && tree[i].tag.toLowerCase() === 'html') {
			return getHead(tree[i].content, tree[i]);
		}
		// Either Head tag can still exist or it has been omitted
		else if(!tree[i].tag || validHeadTags.includes(tree[i].tag.toLowerCase())) {
			continue;
		}
		// Head doesn't exist as this isn't permitted head content
		else {
			return {HTMLNode, index: i};
		}
	}
}