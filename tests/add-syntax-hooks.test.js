const test = require('ava');
const walkTree = require('../components/walk-tree.js');
const parseHTML = require('posthtml-parser');
const renderHTML = require('posthtml-render');


function addSyntaxHooks(HTMLString, options) {
	options = Object.assign(
		{
			defaultLanguage: null,
			highlightSyntax: true,
			removeRedundancy: false,
			showColors: false,
			showLanguages: false,
			showLineNumbers: false,
			usingPostHTML: false,
			scripts: [],
			styles: []
		},
		options
	);

	return renderHTML(walkTree(options)(parseHTML(HTMLString)));
}


test('Highlights multiple Prism languages', t => {
	t.is(addSyntaxHooks('<code>&lt;p>foo &lt;em>bar&lt;/em> baz&lt;/p></code>', {defaultLanguage: 'html'}), '<code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>foo <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>em</span><span class="token punctuation">></span></span>bar<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>em</span><span class="token punctuation">></span></span> baz<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span></code>');

	t.is(addSyntaxHooks('<code>.foo { bar: baz; }</code>', {defaultLanguage: 'css'}), '<code class="language-css"><span class="token selector">.foo</span> <span class="token punctuation">{</span> <span class="token property">bar</span><span class="token punctuation">:</span> baz<span class="token punctuation">;</span> <span class="token punctuation">}</span></code>');

	t.is(addSyntaxHooks('<code>function foo(bar) { return baz; }</code>', {defaultLanguage: 'javascript'}), '<code class="language-javascript"><span class="token keyword">function</span> <span class="token function">foo</span><span class="token punctuation">(</span><span class="token parameter">bar</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> baz<span class="token punctuation">;</span> <span class="token punctuation">}</span></code>');

	t.is(addSyntaxHooks('<code>interface Foo { bar: string; baz: number; }</code>', {defaultLanguage: 'typescript'}), '<code class="language-typescript"><span class="token keyword">interface</span> <span class="token class-name">Foo</span> <span class="token punctuation">{</span> bar<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span> baz<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span> <span class="token punctuation">}</span></code>');

	t.is(addSyntaxHooks('<code>interface Foo { bar: string; baz: number; }</code>', {defaultLanguage: 'ts'}), '<code class="language-ts"><span class="token keyword">interface</span> <span class="token class-name">Foo</span> <span class="token punctuation">{</span> bar<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span> baz<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span> <span class="token punctuation">}</span></code>');

	t.is(addSyntaxHooks(`<code>$ echo '#! /foo/bar/baz'</code>`, {defaultLanguage: 'shell'}), `<code class="language-shell">$ <span class="token builtin class-name">echo</span> <span class="token string">\'#! /foo/bar/baz\'</span></code>`);
});


test('Does not highlight unescaped html', t => {
	t.is(addSyntaxHooks('<code><p>foo</p>&lt;p>bar&lt;/p></code>', {defaultLanguage: 'html'}), '<code class="language-html"><p>foo</p><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>bar<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span></code>');
});


test('Highlights nested code blocks', t => {
	const test = `<code>function test() {
	<code class="language-css">.css {
		within: js;
	}</code>
	return 'should be js';
}</code>`;

	const result = `<code class="language-javascript"><span class="token keyword">function</span> <span class="token function">test</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<code class="language-css"><span class="token selector">.css</span> <span class="token punctuation">{</span>
		<span class="token property">within</span><span class="token punctuation">:</span> js<span class="token punctuation">;</span>
	<span class="token punctuation">}</span></code>
	<span class="token keyword">return</span> <span class="token string">'should be js'</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code>`;

	t.is(addSyntaxHooks(test, {defaultLanguage: 'javascript'}), result);
});


test('Syntax is not highlighted outside of code', t => {
	t.is(addSyntaxHooks('<div>var</div>', {defaultLanguage: 'javascript'}), '<div>var</div>');
	t.is(addSyntaxHooks('<pre>var</pre>', {defaultLanguage: 'javascript'}), '<pre>var</pre>');
	t.is(addSyntaxHooks('<pre>var<code>var</code></pre>', {defaultLanguage: 'javascript'}), '<pre class="language-javascript">var<code class="language-javascript"><span class="token keyword">var</span></code></pre>');
});