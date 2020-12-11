module.exports = function(node, attributeName, attributeValue) {
	if(node.attrs) {
		for(const key in node.attrs) {
			// If attribute exists without value, add it
			if(new RegExp(key, 'i').test(attributeName)) {
				if(!node.attrs[key].includes(attributeValue)) {
					node.attrs[key] = `${node.attrs[key]} ${attributeValue}`;
				}
				return;
			}
		}
	}
	// Attribute doesn't already exist
	node.attrs[attributeName] = attributeValue;
}