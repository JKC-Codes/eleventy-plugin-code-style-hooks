class page {
	data() {
		return {
			title: "JavaScript"
		};
	}

	render({tests}) {
		return tests.reduce((acc, cur) => {
			const code = cur.code.replace(/</gi, '&lt;');
			const language = cur.language ? ` class="language-${cur.language}"` : '';

			return acc +
`<pre><code${language}>${code}</code></pre>
`;
		}, '');
	}
}

module.exports = page;