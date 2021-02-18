module.exports = function addFirstLineNumber(codeNode, state) {
	const lineNumber = {
		tag: 'span',
		attrs: {
			class: 'token line-number',
			'aria-hidden': 'true'
		}
	};

	if(codeNode.content) {
		codeNode.content.unshift(lineNumber);
		// Prevent infinite loops
		state.index++;
	}
	state.needsFirstLine.status = false;
}