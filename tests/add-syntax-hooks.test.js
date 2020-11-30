const test = require('ava');
const parseHTML = require('posthtml-parser');
const renderHTML = require('posthtml-render');
const addStyleHooks = require('../components/add-syntax-hooks.js');

function addHooks(HTMLString) {
	const codeElements = parseHTML(HTMLString);
	addStyleHooks(codeElements);
	return renderHTML(codeElements);
}


test('highlights escaped html', t => {
	const html = `<code class="language-html">&lt;p>foo&lt;/p></code>`;

	t.is(addHooks(html), `<code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>foo<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span></code>`);
});

test('does not highlight unescaped html', t => {
	const html = `<code class="language-html"><p>foo</p></code>`;

	t.is(addHooks(html), `<code class="language-html"><p>foo</p></code>`);
});


test('does not highlight nested code blocks', t => {
	const js = `<code class="language-js">function test() { <code class="language-css">.css { within: js; }</code> return 'should be js'; }</code>`;

	t.is(addHooks(js), `<code class="language-js"><span class="token keyword">function</span> <span class="token function">test</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <code class="language-css">.css { within: js; }</code> <span class="token keyword">return</span> <span class="token string">'should be js'</span><span class="token punctuation">;</span> <span class="token punctuation">}</span></code>`);
});

test('accepts multiple Prism languages', t => {
	const html = `<code class="language-html">&lt;p>foo &lt;em>bar&lt;/em> baz&lt;/p></code>`;
	const css = `<code class="language-css">.foo { bar: baz; }</code>`;
	const js = `<code class="language-js">function foo(bar) { return baz; }</code>`
	const typescript = `<code class="language-typescript">interface Foo { bar: string; baz: number; }</code>`;
	const ts = `<code class="language-ts">interface Foo { bar: string; baz: number; }</code>`;
	const shell = `<code class="language-shell">$ echo '#! /foo/bar/baz</code>`;

	t.is(addHooks(html), `<code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>foo <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>em</span><span class="token punctuation">></span></span>bar<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>em</span><span class="token punctuation">></span></span> baz<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span></code>`);

	t.is(addHooks(css), `<code class="language-css"><span class="token selector">.foo</span> <span class="token punctuation">{</span> <span class="token property">bar</span><span class="token punctuation">:</span> baz<span class="token punctuation">;</span> <span class="token punctuation">}</span></code>`);

	t.is(addHooks(js), `<code class="language-js"><span class="token keyword">function</span> <span class="token function">foo</span><span class="token punctuation">(</span><span class="token parameter">bar</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> baz<span class="token punctuation">;</span> <span class="token punctuation">}</span></code>`);

	t.is(addHooks(typescript), `<code class="language-typescript"><span class="token keyword">interface</span> <span class="token class-name">Foo</span> <span class="token punctuation">{</span> bar<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span> baz<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span> <span class="token punctuation">}</span></code>`);

	t.is(addHooks(ts), `<code class="language-ts"><span class="token keyword">interface</span> <span class="token class-name">Foo</span> <span class="token punctuation">{</span> bar<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span> baz<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span> <span class="token punctuation">}</span></code>`);

	t.is(addHooks(shell), `<code class="language-shell">$ <span class="token builtin class-name">echo</span> \'<span class="token comment">#! /foo/bar/baz</span></code>`);
});