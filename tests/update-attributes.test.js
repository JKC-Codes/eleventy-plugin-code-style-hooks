const test = require('ava');
const walkTree = require('../components/walk-tree.js');
const parseHTML = require('posthtml-parser');
const renderHTML = require('posthtml-render');


function inlineOptions(HTMLString, options) {
	options = Object.assign(
		{
			defaultLanguage: 'none',
			highlightSyntax: false,
			removeRedundancy: false,
			colorPreviews: false,
			languageLabels: false,
			lineNumbers: false,
			usingPostHTML: false,
			scripts: [],
			styles: []
		},
		options
	);

	return renderHTML(walkTree(options)(parseHTML(HTMLString)));
}


test('Converts lang-xxx class to language-xxx', t => {
	t.is(inlineOptions('<code class="lang-foo"></code>'), '<code class="language-foo"></code>');
	t.is(inlineOptions('<code class="langfoo-bar"></code>'), '<code class="langfoo-bar"></code>');
});


test('Converts language classes to lower case', t => {
	t.is(inlineOptions('<code class="Lang-FOO"></code>'), '<code class="language-foo"></code>');
	t.is(inlineOptions('<code class="Language-FOO"></code>'), '<code class="language-foo"></code>');
	t.is(inlineOptions('<code class="lAnGuAgE-hTmL"></code>'), '<code class="language-html"></code>');
	t.is(inlineOptions('<code class="fooLanguage-test"></code>'), '<code class="fooLanguage-test"></code>');
});


test('Inherits language option', t => {
	t.is(inlineOptions('<code></code>', {highlightSyntax: true}), '<code class="language-none"></code>');
	t.is(inlineOptions('<code class="foo"></code>', {highlightSyntax: true}), '<code class="foo language-none"></code>');
	t.is(inlineOptions('<div class="lang-foo"><code></code></div>'), '<div class="lang-foo"><code class="language-foo"></code></div>');
	t.is(inlineOptions('<div class="language-foo"><code></code></div>'), '<div class="language-foo"><code class="language-foo"></code></div>');
	t.is(inlineOptions('<div class="language-foo"><div class="language-bar"><code></code></div></div>'), '<div class="language-foo"><div class="language-bar"><code class="language-bar"></code></div></div>');
	t.is(inlineOptions('<div class="language-baz"><code class="language-foo"></code><code class="lang-bar"></code><code></code></div>'), '<div class="language-baz"><code class="language-foo"></code><code class="language-bar"></code><code class="language-baz"></code></div>');
	t.is(inlineOptions('<div class="alanguage-test"><code></code></div>', {highlightSyntax: true}), '<div class="alanguage-test"><code class="language-none"></code></div>');
});


test('Adds language class to parent Pre', t => {
	t.is(inlineOptions('<pre><code></code></pre>', {highlightSyntax: true}), '<pre class="language-none"><code class="language-none"></code></pre>');
	t.is(inlineOptions('<pre class="foo"><code class="language-test bar"></code></pre>'), '<pre class="foo language-test"><code class="language-test bar"></code></pre>');
	t.is(inlineOptions('<pre><span>foo</span><code></code></pre>', {highlightSyntax: true}), '<pre class="language-none"><span>foo</span><code class="language-none"></code></pre>');
	t.is(inlineOptions('<pre><span>foo<code></code></span></pre>', {highlightSyntax: true}), '<pre class="language-none"><span>foo<code class="language-none"></code></span></pre>');
});


test('Syntax highlighting can be toggled', t => {
	t.is(inlineOptions('<code data-highlight-syntax="true"></code>'), '<code data-highlight-syntax="true" class="language-none"></code>');
	t.is(inlineOptions('<code dAtA-hIgHlIgHt-SyNtAx="TrUe"></code>'), '<code dAtA-hIgHlIgHt-SyNtAx="TrUe" class="language-none"></code>');
	t.is(inlineOptions('<div data-highlight-syntax="true"><code></code></div>'), '<div data-highlight-syntax="true"><code class="language-none"></code></div>');
	t.is(inlineOptions('<div data-highlight-syntax="false"><code></code></div>', {highlightSyntax: true}), '<div data-highlight-syntax="false"><code></code></div>');
	t.is(inlineOptions('<div data-highlight-syntax="false"><div data-highlight-syntax="true"><code></code></div></div>'), '<div data-highlight-syntax="false"><div data-highlight-syntax="true"><code class="language-none"></code></div></div>');
});


test('Adds line-numbers class to code and pre', t => {
	t.is(inlineOptions('<code>foo</code>', {lineNumbers: true}), '<code>foo</code>');
	t.is(inlineOptions('<div class="line-numbers"><code>foo</code></div>'), '<div class="line-numbers"><code>foo</code></div>');
	t.is(inlineOptions('<pre><code>foo</code></pre>', {lineNumbers: true}), '<pre class="line-numbers"><code class="line-numbers"><span class="token line-number" aria-hidden="true"></span>foo</code></pre>');
	t.is(inlineOptions('<pre><code>foo</code></pre><pre></pre>', {lineNumbers: true}), '<pre class="line-numbers"><code class="line-numbers"><span class="token line-number" aria-hidden="true"></span>foo</code></pre><pre></pre>');
	t.is(inlineOptions('<pre><code>foo</code><code>bar</code></pre>', {lineNumbers: true}), '<pre class="line-numbers"><code class="line-numbers"><span class="token line-number" aria-hidden="true"></span>foo</code><code class="line-numbers">bar</code></pre>');
	t.is(inlineOptions('<pre><code>foo<code>bar</code>baz</code></pre>', {lineNumbers: true}), '<pre class="line-numbers"><code class="line-numbers"><span class="token line-number" aria-hidden="true"></span>foo<code class="line-numbers">bar</code>baz</code></pre>');
});


test('Line numbers can be inherited and toggled from attribute', t => {
	t.is(inlineOptions('<pre data-line-numbers="true"><code>foo</code></pre>'), '<pre data-line-numbers="true" class="line-numbers"><code class="line-numbers"><span class="token line-number" aria-hidden="true"></span>foo</code></pre>');
	t.is(inlineOptions('<pre DaTa-LiNe-NuMbErS="TrUe"><code>foo</code></pre>'), '<pre DaTa-LiNe-NuMbErS="TrUe" class="line-numbers"><code class="line-numbers"><span class="token line-number" aria-hidden="true"></span>foo</code></pre>');
	t.is(inlineOptions('<div data-line-numbers="true"><pre><code>foo</code></pre></div>'), '<div data-line-numbers="true"><pre class="line-numbers"><code class="line-numbers"><span class="token line-number" aria-hidden="true"></span>foo</code></pre></div>');
	t.is(inlineOptions('<pre data-line-numbers="false"><code>foo</code></pre>', {lineNumbers: true}), '<pre data-line-numbers="false"><code>foo</code></pre>');
	t.is(inlineOptions('<div data-line-numbers="false"><pre data-line-numbers="true"><code>foo</code></pre></div>'), '<div data-line-numbers="false"><pre data-line-numbers="true" class="line-numbers"><code class="line-numbers"><span class="token line-number" aria-hidden="true"></span>foo</code></pre></div>');
});


test('Adds data-language attribute to code and pre', t => {
	t.is(inlineOptions('<code></code>', {highlightSyntax: true, languageLabels: true}), '<code class="language-none" data-language="none"></code>');
	t.is(inlineOptions('<pre><code></code></pre>', {highlightSyntax: true, languageLabels: true}), '<pre class="language-none" data-language="none"><code class="language-none" data-language="none"></code></pre>');
	t.is(inlineOptions('<pre><code></code></pre><code></code>', {highlightSyntax: true, languageLabels: true}), '<pre class="language-none" data-language="none"><code class="language-none" data-language="none"></code></pre><code class="language-none" data-language="none"></code>');
	t.is(inlineOptions('<code><code></code></code>', {highlightSyntax: true, languageLabels: true}), '<code class="language-none" data-language="none"><code class="language-none" data-language="none"></code></code>');
});


test('Data-language attribute uses language class', t => {
	t.is(inlineOptions('<code class="language-foo"></code>', {languageLabels: true}), '<code class="language-foo" data-language="foo"></code>');
	t.is(inlineOptions('<div class="language-bar"><pre><code></code></pre></div>', {languageLabels: true}), '<div class="language-bar"><pre class="language-bar" data-language="bar"><code class="language-bar" data-language="bar"></code></pre></div>');
	t.is(inlineOptions('<code class="alanguage-test"></code>', {highlightSyntax: true, languageLabels: true}), '<code class="alanguage-test language-none" data-language="none"></code>');
});


test('Show language option can be inherited and toggled from parent language classes', t => {
	t.is(inlineOptions('<pre data-language-labels="true"><code></code></pre>', {highlightSyntax: true}), '<pre data-language-labels="true" class="language-none" data-language="none"><code class="language-none" data-language="none"></code></pre>');
	t.is(inlineOptions('<pre DaTa-LaNgUaGe-LaBeLs="TrUe"><code></code></pre>', {highlightSyntax: true}), '<pre DaTa-LaNgUaGe-LaBeLs="TrUe" class="language-none" data-language="none"><code class="language-none" data-language="none"></code></pre>');
	t.is(inlineOptions('<div data-language-labels="true"><pre><code></code></pre>', {highlightSyntax: true}), '<div data-language-labels="true"><pre class="language-none" data-language="none"><code class="language-none" data-language="none"></code></pre></div>');
	t.is(inlineOptions('<pre data-language-labels="false"><code></code></pre>', {highlightSyntax: true}), '<pre data-language-labels="false" class="language-none"><code class="language-none"></code></pre>');
	t.is(inlineOptions('<div data-language-labels="false"><pre data-language-labels="true"><code></code></pre></div>', {highlightSyntax: true}), '<div data-language-labels="false"><pre data-language-labels="true" class="language-none" data-language="none"><code class="language-none" data-language="none"></code></pre></div>');
});


test('Show colours option can be inherited and toggled from parent attributes', t => {
	function inheritedColor(html, options) {
		return inlineOptions(html, options).includes('<span class="token color">');
	}

	t.true(inheritedColor('<pre data-color-previews="true"><code>#fff</code></pre>', {defaultLanguage: 'css', highlightSyntax: true}));
	t.true(inheritedColor('<pre DaTa-CoLoR-pReViEwS="TrUe"><code>#fff</code></pre>', {defaultLanguage: 'css', highlightSyntax: true}));
	t.true(inheritedColor('<div data-color-previews="true"><pre><code>#fff</code></pre>', {defaultLanguage: 'css', highlightSyntax: true}));
	t.true(inheritedColor('<div data-color-previews="false"><pre data-color-previews="true"><code>#fff</code></pre></div>', {defaultLanguage: 'css', highlightSyntax: true}));
	t.false(inheritedColor('<pre data-color-previews="false"><code>#fff</code></pre>', {defaultLanguage: 'css', highlightSyntax: true}));
});


test('Redundant language classes are removed', t => {
	t.is(inlineOptions('<pre class="language-foo"></pre>', {removeRedundancy: true}), '<pre></pre>');
	t.is(inlineOptions('<div class="language-foo"></div>', {removeRedundancy: true}), '<div></div>');
	t.is(inlineOptions('<pre class="alanguage-test"></pre>', {removeRedundancy: true}), '<pre class="alanguage-test"></pre>');

	t.is(inlineOptions('<pre class="language-foo language-foo"></pre>', {removeRedundancy: true}), '<pre></pre>');
	t.is(inlineOptions('<code class="language-foo language-foo"></code>', {removeRedundancy: true}), '<code class="language-foo"></code>');
	t.is(inlineOptions('<code class="language-foo language-bar"></code>', {removeRedundancy: true}), '<code class="language-foo"></code>');

	t.is(inlineOptions('<code class="test language-foo language-bar"></code>', {removeRedundancy: true}), '<code class="test language-foo"></code>');
	t.is(inlineOptions('<code class="language-foo language-bar test"></code>', {removeRedundancy: true}), '<code class="language-foo test"></code>');
	t.is(inlineOptions('<code class=" foo language-test language-test bar  "></code>', {removeRedundancy: true}), '<code class=" foo language-test bar  "></code>');
	t.is(inlineOptions('<code class="foo    language-test  language-test  bar"></code>', {removeRedundancy: true}), '<code class="foo    language-test   bar"></code>');
	t.is(inlineOptions('<code class="foo language-test bar language-test baz"></code>', {removeRedundancy: true}), '<code class="foo language-test bar baz"></code>');

	t.is(inlineOptions('<code class=""></code>', {removeRedundancy: true}), '<code class=""></code>');
	t.is(inlineOptions('<pre class="foo language-html bar"><code class="language-css language-js"></code></pre>', {removeRedundancy: true}), '<pre class="foo bar language-css"><code class="language-css"></code></pre>');
	t.is(inlineOptions('<pre class="language-test1 language-bar"><code class="language-foo language-bar language-baz language-foo language-test2 language-bar language-baz"></code><code class="language-bar language-baz language-foo language-bar language-baz"></code></pre>', {removeRedundancy: true}), '<pre class="language-bar language-foo"><code class="language-foo"></code><code class="language-bar"></code></pre>');
	t.is(inlineOptions('<div class="foo	language-tabspaces	bar"></div>', {removeRedundancy: true}), '<div class="foo	bar"></div>');
	t.is(inlineOptions('<div class="foo language-tabspaces	bar"></div>', {removeRedundancy: true}), '<div class="foo	bar"></div>');
});


test('Redundant line-number classes are removed', t => {
	t.is(inlineOptions('<pre class="line-numbers"></pre>', {removeRedundancy: true}), '<pre></pre>');
	t.is(inlineOptions('<code class="line-numbers"></code>', {removeRedundancy: true}), '<code></code>');
	t.is(inlineOptions('<div class="line-numbers"></div>', {removeRedundancy: true}), '<div class="line-numbers"></div>');
	t.is(inlineOptions('<pre class="line-number"></pre>', {removeRedundancy: true}), '<pre class="line-number"></pre>');

	t.is(inlineOptions('<pre class="line-numbers line-numbers"><code></code></pre>', {removeRedundancy: true}), '<pre><code></code></pre>');
	t.is(inlineOptions('<pre><code class="line-numbers line-numbers"></code></pre>', {removeRedundancy: true}), '<pre><code></code></pre>');

	t.is(inlineOptions('<pre class="line-numbers line-numbers"><code>foo</code></pre>', {removeRedundancy: true, lineNumbers: true}), '<pre class="line-numbers"><code class="line-numbers"><span class="token line-number" aria-hidden="true"></span>foo</code></pre>');
	t.is(inlineOptions('<pre><code class="line-numbers line-numbers">foo</code></pre>', {removeRedundancy: true, lineNumbers: true}), '<pre class="line-numbers"><code class="line-numbers"><span class="token line-number" aria-hidden="true"></span>foo</code></pre>');

	t.is(inlineOptions('<pre class="foo line-numbers"></pre>', {removeRedundancy: true}), '<pre class="foo"></pre>');
	t.is(inlineOptions('<pre class="foo line-numbers bar"></pre>', {removeRedundancy: true}), '<pre class="foo bar"></pre>');
	t.is(inlineOptions('<pre class=" foo line-numbers bar  "></pre>', {removeRedundancy: true}), '<pre class=" foo bar  "></pre>');
	t.is(inlineOptions('<pre class="foo    line-numbers   bar"></pre>', {removeRedundancy: true}), '<pre class="foo      bar"></pre>');
	t.is(inlineOptions('<pre><code class="foo line-numbers bar line-numbers baz"></code></pre>', {removeRedundancy: true}), '<pre><code class="foo bar baz"></code></pre>');
});


test('Redundant language and line-number classes are removed', t => {
	t.is(inlineOptions('<pre class="language-foo line-numbers language-bar line-numbers"></pre>', {removeRedundancy: true, lineNumbers: true}), '<pre></pre>');
	t.is(inlineOptions('<code class="language-foo line-numbers language-bar"></code>', {removeRedundancy: true, lineNumbers: true}), '<code class="language-foo"></code>');
	t.is(inlineOptions('<pre><code class="language-foo line-numbers language-bar line-numbers">foo</code></pre>', {removeRedundancy: true, lineNumbers: true}), '<pre class="language-foo line-numbers"><code class="language-foo line-numbers"><span class="token line-number" aria-hidden="true"></span>foo</code></pre>');
	t.is(inlineOptions('<pre class="language-foo foo language-bar bar language-baz baz"><code>foo</code></pre>', {removeRedundancy: true, lineNumbers: true}), '<pre class="language-foo foo bar baz line-numbers"><code class="language-foo line-numbers"><span class="token line-number" aria-hidden="true"></span>foo</code></pre>');
	t.is(inlineOptions('<pre class="line-numbers foo line-numbers bar line-numbers baz"><code>foo</code></pre>', {removeRedundancy: true, lineNumbers: true, highlightSyntax: true}), '<pre class="line-numbers foo bar baz language-none"><code class="language-none line-numbers"><span class="token line-number" aria-hidden="true"></span>foo</code></pre>');
	t.is(inlineOptions('<pre class="language-foo averyverylongclassnamegoeshere language-bar"><code>foo</code></pre>', {removeRedundancy: true, lineNumbers: true, highlightSyntax: true}), '<pre class="language-foo averyverylongclassnamegoeshere line-numbers"><code class="language-foo line-numbers"><span class="token line-number" aria-hidden="true"></span>foo</code></pre>');
});


test('Redundant attributes are removed', t => {
	t.is(inlineOptions('<div data-highlight-syntax="true"></div>', {removeRedundancy: true}), '<div></div>');
	t.is(inlineOptions('<div data-highlight-syntax="false"></div>', {removeRedundancy: true}), '<div></div>');
	t.is(inlineOptions('<div data-line-numbers="true"></div>', {removeRedundancy: true}), '<div></div>');
	t.is(inlineOptions('<div data-line-numbers="false"></div>', {removeRedundancy: true}), '<div></div>');
	t.is(inlineOptions('<div data-language-labels="true"></div>', {removeRedundancy: true}), '<div></div>');
	t.is(inlineOptions('<div data-language-labels="false"></div>', {removeRedundancy: true}), '<div></div>');
	t.is(inlineOptions('<div data-color-previews="true"></div>', {removeRedundancy: true}), '<div></div>');
	t.is(inlineOptions('<div data-color-previews="false"></div>', {removeRedundancy: true}), '<div></div>');

	t.is(inlineOptions('<div data-highlight-syntax="true" data-line-numbers="true" data-language-labels="true" data-color-previews="true"></div>', {removeRedundancy: true}), '<div></div>');
	t.is(inlineOptions('<div data-highlight-syntax="false" data-line-numbers="false" data-language-labels="false" data-color-previews="false"></div>', {removeRedundancy: true}), '<div></div>');

	t.is(inlineOptions('<pre data-highlight-syntax="true" data-line-numbers="true" data-language-labels="true" data-color-previews="true"></pre>', {removeRedundancy: true}), '<pre></pre>');
	t.is(inlineOptions('<code data-highlight-syntax="false" data-line-numbers="false" data-language-labels="false" data-color-previews="false"></code>', {removeRedundancy: true}), '<code></code>');

	t.is(inlineOptions('<div data-highlight-syntax="true" data-highlight-syntax="true" data-line-numbers="true" data-line-numbers="true" data-language-labels="true" data-language-labels="true" data-color-previews="true" data-color-previews="true"></div>', {removeRedundancy: true}), '<div></div>');

	t.is(inlineOptions('<div data-foo="bar" data-highlight-syntax="true"></div>', {removeRedundancy: true}), '<div data-foo="bar"></div>');
	t.is(inlineOptions('<div data-foo="bar" data-highlight-syntax="true" data-baz="true"></div>', {removeRedundancy: true}), '<div data-foo="bar" data-baz="true"></div>');
});


test('Ignores case sensitivity', t => {
	t.is(inlineOptions('<code ClAsS="lang-foo"></code>'), '<code ClAsS="language-foo"></code>');
	t.is(inlineOptions('<code class="lAnG-fOo"></code>'), '<code class="language-foo"></code>');
	t.is(inlineOptions('<CoDe class="lang-foo"></CoDe>'), '<CoDe class="language-foo"></CoDe>');
	t.is(inlineOptions('<CoDe ClAsS="lAnG-fOo"></CoDe>'), '<CoDe ClAsS="language-foo"></CoDe>');
	t.is(inlineOptions('<PrE cLaSs="LaNg-FoO"><code></code></PrE>'), '<PrE cLaSs="language-foo"><code class="language-foo"></code></PrE>');
});