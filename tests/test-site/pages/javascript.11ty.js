class page {
	data() {
		return {
			title: "JavaScript"
		};
	}

	render({tests}) {
		const html = tests.reduce((acc, cur) => {
			return acc + `\n\t\t<li><pre><code class="language-${cur.language}">${cur.code}</code></pre></li>`;
		}, '');
		return `\n<ul>${html}\n</ul>`;
	}
}

module.exports = page;