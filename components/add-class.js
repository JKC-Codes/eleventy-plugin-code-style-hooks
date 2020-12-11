module.exports = function(node, className) {
	let classes = [];

	if(!node.attrs) {
		node.attrs = {};
	}

	if(node.attrs.class) {
		classes = node.attrs.class.split(' ');
	}

	if(!classes.includes(className)) {
		classes.push(className);
		node.attrs.class = classes.join(' ');
	}
}