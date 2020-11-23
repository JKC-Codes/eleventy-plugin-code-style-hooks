class page {
	data() {
		return {
			title: "JavaScript"
		};
	}

	render({tests}) {
		return tests.reduce((acc, cur) => {
			return acc +
`<pre><code class="language-${cur.language}">${cur.code}
</code></pre>
`;
		}, '');
	}
}

module.exports = page;