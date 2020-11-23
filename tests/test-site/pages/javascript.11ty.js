class page {
	data() {
		return {
			title: "JavaScript"
		};
	}

	render({tests}) {
		const html = tests.reduce((acc, cur) => {
			return acc +
`<li><pre><code class="language-${cur.language}">${cur.code}</code></pre></li>`;
		}, '');
		return `\n<ul>${html}</ul>`;
	}
}

module.exports = page;