class page {
	data() {
		return {
			title: "JavaScript"
		};
	}

	render({tests}) {
		return tests.reduce((acc, cur) => {
			const code = cur.code.replace(/</gi, '&lt;');
			return acc +
`<pre><code class="language-${cur.language}">${code}
</code></pre>
`;
		}, '');
	}
}

module.exports = page;