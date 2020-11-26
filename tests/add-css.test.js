const test = require('ava');
const posthtml = require('posthtml');
const optionsParser = require('../components/options-parser.js');
const addCSSComponent = require('../components/add-css.js');


function addCSS(HTMLString, options = 'styles.css') {
	options = optionsParser({styles:options});

	return posthtml([ast => addCSSComponent(ast, options)])
	.process(HTMLString)
	.then(abstractSyntaxTree => {
		return abstractSyntaxTree.html
	})
}


test('adds CSS to head', async t => {
	const test1 = await addCSS('<head></head><code class="language-foo"></code>');
	const test2 = await addCSS('<!doctype html><head></head><code class="language-foo"></code>');
	const test3 = await addCSS(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>testing</title>
</head>
<code class="language-foo"></code>`);

	t.is(test1, '<head><link rel="stylesheet" href="styles.css"></head><code class="language-foo"></code>');

	t.is(test2, '<!doctype html><head><link rel="stylesheet" href="styles.css"></head><code class="language-foo"></code>');

	t.is(test3, `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>testing</title>
<link rel="stylesheet" href="styles.css"></head>
<code class="language-foo"></code></html>`);
});


test('adds CSS to document without head', async t => {
	const test1 = await addCSS('<code class="language-foo"></code>');
	const test2 = await addCSS('<!doctype html><code class="language-foo"></code>');
	const test3 = await addCSS(`<!DOCTYPE html>
<html lang="en">
<code class="language-foo"></code>`);

	t.is(test1, '<link rel="stylesheet" href="styles.css"><code class="language-foo"></code>');

	t.is(test2, '<!doctype html><link rel="stylesheet" href="styles.css"><code class="language-foo"></code>');

	t.is(test3, `<!DOCTYPE html>
<html lang="en">
<link rel="stylesheet" href="styles.css"><code class="language-foo"></code></html>`);
});


test('accepts string as CSS', async t => {
	const test1 = await addCSS('<code class="language-foo"></code>', 'foo.css');

	t.is(test1, '<link rel="stylesheet" href="foo.css"><code class="language-foo"></code>');
});


test('accepts array of strings as CSS', async t => {
	const test1 = await addCSS('<code class="language-foo"></code>', ['foo.css', 'bar.css', 'baz.css']);

	t.is(test1, '<link rel="stylesheet" href="foo.css"><link rel="stylesheet" href="bar.css"><link rel="stylesheet" href="baz.css"><code class="language-foo"></code>');
});


test('accepts object as CSS', async t => {
	const test1 = await addCSS('<code class="language-foo"></code>', {href: 'foo.css'});
	const test2 = await addCSS('<code class="language-foo"></code>', {href: 'foo.css', foo: 'bar'});

	t.is(test1, '<link rel="stylesheet" href="foo.css"><code class="language-foo"></code>');
	t.is(test2, '<link rel="stylesheet" href="foo.css" foo="bar"><code class="language-foo"></code>');
});


test('accepts array of objects as CSS', async t => {
	const test1 = await addCSS('<code class="language-foo"></code>', [{href: 'foo.css'}, {href: 'bar.css'}, {href: 'baz.css'}]);
	const test2 = await addCSS('<code class="language-foo"></code>', [{href: 'foo.css', media: '(prefers-color-scheme: dark)'}, {href: 'bar.css', random: 'attribute'}, {rel: 'changed', href: 'baz.css'}]);

	t.is(test1, '<link rel="stylesheet" href="foo.css"><link rel="stylesheet" href="bar.css"><link rel="stylesheet" href="baz.css"><code class="language-foo"></code>');
	t.is(test2, '<link rel="stylesheet" href="foo.css" media="(prefers-color-scheme: dark)"><link rel="stylesheet" href="bar.css" random="attribute"><link rel="changed" href="baz.css"><code class="language-foo"></code>');
});