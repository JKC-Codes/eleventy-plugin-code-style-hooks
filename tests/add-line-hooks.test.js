const test = require('ava');
const walkTree = require('../components/walk-tree.js');
const parseHTML = require('posthtml-parser');
const renderHTML = require('posthtml-render');


function addLineHooks(HTMLString, options) {
	options = Object.assign(
		{
			defaultLanguage: 'none',
			highlightSyntax: false,
			removeRedundancy: false,
			colorPreviews: false,
			languageLabels: false,
			lineNumbers: true,
			usingPostHTML: false,
			scripts: [],
			styles: []
		},
		options
	);

	return renderHTML(walkTree(options)(parseHTML(HTMLString)));
}


test('Adds line numbers', t => {
	t.is(addLineHooks(`<pre><code>foo</code></pre>`), `<pre class="line-numbers"><span class="token line-number" aria-hidden="true"></span><code class="line-numbers">foo</code></pre>`);

	t.is(addLineHooks(`<pre><code>foo
bar
baz</code></pre>`),
`<pre class="line-numbers"><span class="token line-number" aria-hidden="true"></span><code class="line-numbers">foo
<span class="token line-number" aria-hidden="true"></span>bar
<span class="token line-number" aria-hidden="true"></span>baz</code></pre>`);

	t.is(addLineHooks(`<pre><code>
foo
bar
baz
</code></pre>`),
`<pre class="line-numbers"><span class="token line-number" aria-hidden="true"></span><code class="line-numbers">
<span class="token line-number" aria-hidden="true"></span>foo
<span class="token line-number" aria-hidden="true"></span>bar
<span class="token line-number" aria-hidden="true"></span>baz
<span class="token line-number" aria-hidden="true"></span></code></pre>`);
});


test('Line numbers ignore code not in pre', t => {
	t.is(addLineHooks(`<code>foo</code>`), `<code>foo</code>`);
	t.is(addLineHooks(`<div><code>foo</code></div>`), `<div><code>foo</code></div>`);
	t.is(addLineHooks(`<pre></pre><code>foo</code><pre></pre>`), `<pre></pre><code>foo</code><pre></pre>`);
});


test('Line numbers ignore non-code in pre', t => {
	t.is(addLineHooks(`<pre>
<span>foo</span>
<code>bar</code>
</pre>`),
`<pre class="line-numbers">
<span>foo</span>
<span class="token line-number" aria-hidden="true"></span><code class="line-numbers">bar</code>
</pre>`);

	t.is(addLineHooks(`<pre>
<span>foo</span>
<code>
bar
</code>
</pre>`),
`<pre class="line-numbers">
<span>foo</span>
<span class="token line-number" aria-hidden="true"></span><code class="line-numbers">
<span class="token line-number" aria-hidden="true"></span>bar
<span class="token line-number" aria-hidden="true"></span></code>
</pre>`);

	t.is(addLineHooks(`<pre>
<span>foo</span><code>
bar
</code>
</pre>`),
`<pre class="line-numbers">
<span class="token line-number" aria-hidden="true"></span><span>foo</span><code class="line-numbers">
<span class="token line-number" aria-hidden="true"></span>bar
<span class="token line-number" aria-hidden="true"></span></code>
</pre>`);

	t.is(addLineHooks(`<pre><span>foo
</span><code>bar
</code></pre>`),
`<pre class="line-numbers"><span>foo
<span class="token line-number" aria-hidden="true"></span></span><code class="line-numbers">bar
<span class="token line-number" aria-hidden="true"></span></code></pre>`);
});


test('Line numbers handle multiple code elements', t => {
	t.is(addLineHooks(`<pre>
this line shouldn't be numbered
<code>let line1;</code><code>let stillLine1;</code><code>let lastOfLine1;
let line2;</code>
<code>let line3;</code>
this line shouldn't be numbered
</pre>`),
`<pre class="line-numbers">
this line shouldn't be numbered
<span class="token line-number" aria-hidden="true"></span><code class="line-numbers">let line1;</code><code class="line-numbers">let stillLine1;</code><code class="line-numbers">let lastOfLine1;
<span class="token line-number" aria-hidden="true"></span>let line2;</code>
<span class="token line-number" aria-hidden="true"></span><code class="line-numbers">let line3;</code>
this line shouldn't be numbered
</pre>`);

	t.is(addLineHooks(`<pre>
this line shouldn't be numbered
<code>let line1;</code><code>let stillLine1;</code><code>let lastOfLine1;
let line2;</code>
this line shouldn't be numbered
<code>let line3;</code>
this line shouldn't be numbered
</pre>`),
`<pre class="line-numbers">
this line shouldn't be numbered
<span class="token line-number" aria-hidden="true"></span><code class="line-numbers">let line1;</code><code class="line-numbers">let stillLine1;</code><code class="line-numbers">let lastOfLine1;
<span class="token line-number" aria-hidden="true"></span>let line2;</code>
this line shouldn't be numbered
<span class="token line-number" aria-hidden="true"></span><code class="line-numbers">let line3;</code>
this line shouldn't be numbered
</pre>`);
});