const test = require('ava');
const posthtml = require('posthtml');
const transformHTML = require('../components/transform-HTML.js');
const defaultOptions = {
	removeRedundancy: true,
	styles: []
}

function addClasses(HTMLString, options) {
	options = Object.assign({}, defaultOptions, options);

	return posthtml([transformHTML(options)])
	.process(HTMLString)
	.then(abstractSyntaxTree => {
		return abstractSyntaxTree.html
	})
}


test('changes lang to language', async t => {
	const test1 = await addClasses('<code class="lang-foo"></code>');

	t.is(test1, '<code class="language-foo"></code>');
});

test('is case insensitive', async t => {
	const test1 = await addClasses('<code class="LANG-foo"></code>');
	const test2 = await addClasses('<code class="lang-FOO"></code>');

	t.is(test1, '<code class="language-foo"></code>');
	t.is(test2, '<code class="language-foo"></code>');
});

test('code elements inherit language classes from parents', async t => {
	const test1 = await addClasses('<pre class="language-foo"><code></code></pre>');
	const test2 = await addClasses('<div class="language-foo"><pre><code></code></pre></div>');
	const test3 = await addClasses('<div class="language-foo language-bar"><pre><code></code></pre></div>');
	const test4 = await addClasses('<div class="language-foo ignore"><pre><code></code></pre></div>');

	t.is(test1, '<pre class="language-foo"><code class="language-foo"></code></pre>');
	t.is(test2, '<div class="language-foo"><pre class="language-foo"><code class="language-foo"></code></pre></div>');
	t.is(test3, '<div class="language-foo language-bar"><pre class="language-foo language-bar"><code class="language-foo language-bar"></code></pre></div>');
	t.is(test4, '<div class="language-foo ignore"><pre class="language-foo"><code class="language-foo"></code></pre></div>');
});

test('pre elements inherit class from code direct children', async t => {
	const test1 = await addClasses('<pre><code class="language-foo"></code></pre>');
	const test2 = await addClasses('<pre><span></span><code class="language-foo"></code></pre>');
	const test3 = await addClasses('<pre><span><code class="language-foo"></code></span></pre>');
	const test4 = await addClasses('<pre><code class="language-foo ignore"></code></pre>');
	const test5 = await addClasses('<pre><code class="language-foo language-bar"></code></pre>');

	t.is(test1, '<pre class="language-foo"><code class="language-foo"></code></pre>');
	t.is(test2, '<pre class="language-foo"><span></span><code class="language-foo"></code></pre>');
	t.is(test3, '<pre><span><code class="language-foo"></code></span></pre>');
	t.is(test4, '<pre class="language-foo"><code class="language-foo ignore"></code></pre>');
	t.is(test5, '<pre class="language-foo language-bar"><code class="language-foo language-bar"></code></pre>');
});

test('removes unused language classes from pre', async t => {
	const test1 = await addClasses('<pre class="language-bar"><code class="language-foo"></code></pre>');
	const test2 = await addClasses('<pre class="language-bar leave"><code class="language-foo"></code></pre>');
	const test3 = await addClasses('<div class="language-bar"><code class="language-foo"></code></div>');

	t.is(test1, '<pre class="language-foo"><code class="language-foo"></code></pre>');
	t.is(test2, '<pre class="leave language-foo"><code class="language-foo"></code></pre>');
	t.is(test3, '<div class="language-bar"><code class="language-foo"></code></div>');
});

test('respects removeRedundancy option', async t => {
	const test1 = await addClasses('<pre class="language-bar"><code class="language-foo"></code></pre>', {removeRedundancy: false});
	const test2 = await addClasses('<pre class="language-bar leave"><code class="language-foo"></code></pre>', {removeRedundancy: false});

	t.is(test1, '<pre class="language-bar language-foo"><code class="language-foo"></code></pre>');
	t.is(test2, '<pre class="language-bar leave language-foo"><code class="language-foo"></code></pre>');
});

test('ignores inheritance if prism-ignore found', async t => {
	const test1 = await addClasses('<pre class="language-foo"><code data-prism="ignore"></code></pre>');
	const test2 = await addClasses('<pre class="language-foo"><code data-Prism="ignore"></code></pre>');
	const test3 = await addClasses('<pre class="language-foo"><code data-prism="Ignore"></code></pre>');
	const test4 = await addClasses('<div class="language-foo"><div data-prism="ignore"><pre><code></code></pre></div></div>');
	const test5 = await addClasses('<div class="language-foo"><div data-prism="ignore"><pre class="language-bar"><code></code></pre></div></div>');
	const test6 = await addClasses('<div data-prism="ignore" class="language-foo"><pre><code></code></pre></div>');

	t.is(test1, '<pre class="language-foo"><code data-prism="ignore"></code></pre>');
	t.is(test2, '<pre class="language-foo"><code data-Prism="ignore"></code></pre>');
	t.is(test3, '<pre class="language-foo"><code data-prism="Ignore"></code></pre>');
	t.is(test4, '<div class="language-foo"><div data-prism="ignore"><pre><code></code></pre></div></div>');
	t.is(test5, '<div class="language-foo"><div data-prism="ignore"><pre class="language-bar"><code class="language-bar"></code></pre></div></div>');
	t.is(test6, '<div data-prism="ignore" class="language-foo"><pre class="language-foo"><code class="language-foo"></code></pre></div>');
});

test('maintains class spacing', async t => {
	const test1 = await addClasses('<code class=" lang-foo   lang-bar "></code>');
	const test2 = await addClasses('<code class=" foo  lang-bar baz "></code>');

	t.is(test1, '<code class=" language-foo   language-bar "></code>');
	t.is(test2, '<code class=" foo  language-bar baz "></code>');
});

test('identical elements are treated separately', async t => {
	const test1 = await addClasses('<div class="language-foo"><code></code><div class="language-bar"><code></code></div></div>');
	const test2 = await addClasses('<div class="language-foo"><div class="language-bar"><code></code></div><code></code></div>');

	t.is(test1, '<div class="language-foo"><code class="language-foo"></code><div class="language-bar"><code class="language-bar"></code></div></div>');
	t.is(test2, '<div class="language-foo"><div class="language-bar"><code class="language-bar"></code></div><code class="language-foo"></code></div>');
});