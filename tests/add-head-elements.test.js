const test = require('ava');
const addHeadElements = require('../components/add-head-elements.js');
const parseHTML = require('posthtml-parser');
const renderHTML = require('posthtml-render');


function addHead(AST, styles, scripts) {
	const tree = parseHTML(AST);
	const stylesArray = styles.map(style => {
		if(typeof style === 'string') {
			return {
				tag: 'link',
				attrs: {
					rel: 'stylesheet',
					href: style
				}
			};
		}
		else {
			return style;
		}
	});
	const scriptsArray = scripts.map(script => {
		if(typeof script === 'string') {
			return {
				tag: 'script',
				attrs: {
					src: script
				}
			};
		}
		else {
			return script;
		}
	});

	addHeadElements(tree, stylesArray, scriptsArray);
	return renderHTML(tree);
}


const headNoDoctype = `<head></head><code class="language-foo"></code>`;
const headWithDoctype = `<!doctype html><head></head><code class="language-foo"></code>`;
const noHeadNoDoctype = `<code class="language-foo"></code>`;
const noHeadNoDoctypeCased = `<tItLe>testing</tItLe><CoDe ClAsS="language-foo"></CoDe>`;
const noHeadWithDoctype = `<!doctype html><code class="language-foo"></code>`;
const fullTree =
`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>testing</title>
</head>
<code class="language-foo"></code>
</html>`;
const fullTreeCased =
`<!dOcTyPe HtMl>
<hTmL lAnG="eN">
<hEaD>
	<tItLe>testing</tItLe>
</hEaD>
<CoDe ClAsS="lAnGuAgE-fOo"></CoDe>
</hTmL>`;

const styleString = ['styles.css'];
const styleObject = [{
	tag: 'link',
	attrs: {
		rel: 'stylesheet',
		href: 'styles.css',
		media: '(prefers-color-scheme: dark)'
	}
}];
const scriptString = ['script.js'];
const scriptObject = [{
	tag: 'script',
	attrs: {
		src: 'script.js',
		defer: ''
	}
}];


test('Adds head elements when head exists', t => {
	t.is(addHead(headNoDoctype, styleString, []), `<head><link rel="stylesheet" href="styles.css"></head><code class="language-foo"></code>`);
	t.is(addHead(headWithDoctype, styleString, []), `<!doctype html><head><link rel="stylesheet" href="styles.css"></head><code class="language-foo"></code>`);
	t.is(addHead(fullTree, styleString, []), `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>testing</title>
<link rel="stylesheet" href="styles.css"></head>
<code class="language-foo"></code>
</html>`);

	t.is(addHead(headNoDoctype, styleObject, []), `<head><link rel="stylesheet" href="styles.css" media="(prefers-color-scheme: dark)"></head><code class="language-foo"></code>`);
	t.is(addHead(headWithDoctype, styleObject, []), `<!doctype html><head><link rel="stylesheet" href="styles.css" media="(prefers-color-scheme: dark)"></head><code class="language-foo"></code>`);
	t.is(addHead(fullTree, styleObject, []), `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>testing</title>
<link rel="stylesheet" href="styles.css" media="(prefers-color-scheme: dark)"></head>
<code class="language-foo"></code>
</html>`);

	t.is(addHead(headNoDoctype, [], scriptString), `<head><script src="script.js"></script></head><code class="language-foo"></code>`);
	t.is(addHead(headWithDoctype, [], scriptString), `<!doctype html><head><script src="script.js"></script></head><code class="language-foo"></code>`);
	t.is(addHead(fullTree, [], scriptString), `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>testing</title>
<script src="script.js"></script></head>
<code class="language-foo"></code>
</html>`);

	t.is(addHead(headNoDoctype, [], scriptObject), `<head><script src="script.js" defer=""></script></head><code class="language-foo"></code>`);
	t.is(addHead(headWithDoctype, [], scriptObject), `<!doctype html><head><script src="script.js" defer=""></script></head><code class="language-foo"></code>`);
	t.is(addHead(fullTree, [], scriptObject), `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>testing</title>
<script src="script.js" defer=""></script></head>
<code class="language-foo"></code>
</html>`);

	t.is(addHead(headNoDoctype, styleString, scriptString), `<head><link rel="stylesheet" href="styles.css"><script src="script.js"></script></head><code class="language-foo"></code>`);
	t.is(addHead(headNoDoctype, styleObject, scriptObject), `<head><link rel="stylesheet" href="styles.css" media="(prefers-color-scheme: dark)"><script src="script.js" defer=""></script></head><code class="language-foo"></code>`);
	t.is(addHead(headNoDoctype, styleString, scriptString), `<head><link rel="stylesheet" href="styles.css"><script src="script.js"></script></head><code class="language-foo"></code>`);
	t.is(addHead(headNoDoctype, styleObject, scriptObject), `<head><link rel="stylesheet" href="styles.css" media="(prefers-color-scheme: dark)"><script src="script.js" defer=""></script></head><code class="language-foo"></code>`);
	t.is(addHead(headNoDoctype, ['foo.css', ...styleObject], ['bar.js', ...scriptObject]), `<head><link rel="stylesheet" href="foo.css"><link rel="stylesheet" href="styles.css" media="(prefers-color-scheme: dark)"><script src="bar.js"></script><script src="script.js" defer=""></script></head><code class="language-foo"></code>`);
});


test('Adds head elements when head does not exist', t => {
	t.is(addHead(noHeadNoDoctype, styleString, []), `<link rel="stylesheet" href="styles.css"><code class="language-foo"></code>`);
	t.is(addHead(noHeadWithDoctype, styleString, []), `<!doctype html><link rel="stylesheet" href="styles.css"><code class="language-foo"></code>`);

	t.is(addHead(noHeadNoDoctype, styleObject, []), `<link rel="stylesheet" href="styles.css" media="(prefers-color-scheme: dark)"><code class="language-foo"></code>`);
	t.is(addHead(noHeadWithDoctype, styleObject, []), `<!doctype html><link rel="stylesheet" href="styles.css" media="(prefers-color-scheme: dark)"><code class="language-foo"></code>`);

	t.is(addHead(noHeadNoDoctype, [], scriptString), `<script src="script.js"></script><code class="language-foo"></code>`);
	t.is(addHead(noHeadWithDoctype, [], scriptString), `<!doctype html><script src="script.js"></script><code class="language-foo"></code>`);

	t.is(addHead(noHeadNoDoctype, [], scriptObject), `<script src="script.js" defer=""></script><code class="language-foo"></code>`);
	t.is(addHead(noHeadWithDoctype, [], scriptObject), `<!doctype html><script src="script.js" defer=""></script><code class="language-foo"></code>`);

	t.is(addHead(noHeadNoDoctype, styleString, scriptString), `<link rel="stylesheet" href="styles.css"><script src="script.js"></script><code class="language-foo"></code>`);
	t.is(addHead(noHeadNoDoctype, styleObject, scriptObject), `<link rel="stylesheet" href="styles.css" media="(prefers-color-scheme: dark)"><script src="script.js" defer=""></script><code class="language-foo"></code>`);
	t.is(addHead(noHeadNoDoctype, styleString, scriptString), `<link rel="stylesheet" href="styles.css"><script src="script.js"></script><code class="language-foo"></code>`);
	t.is(addHead(noHeadNoDoctype, styleObject, scriptObject), `<link rel="stylesheet" href="styles.css" media="(prefers-color-scheme: dark)"><script src="script.js" defer=""></script><code class="language-foo"></code>`);
	t.is(addHead(noHeadNoDoctype, ['foo.css', ...styleObject], ['bar.js', ...scriptObject]), `<link rel="stylesheet" href="foo.css"><link rel="stylesheet" href="styles.css" media="(prefers-color-scheme: dark)"><script src="bar.js"></script><script src="script.js" defer=""></script><code class="language-foo"></code>`);
});

test('Is case insensitive', t => {
	t.is(addHead(noHeadNoDoctypeCased, styleString, []), `<tItLe>testing</tItLe><link rel="stylesheet" href="styles.css"><CoDe ClAsS="language-foo"></CoDe>`);
	t.is(addHead(fullTreeCased, styleString, []), `<!dOcTyPe HtMl>
<hTmL lAnG="eN">
<hEaD>
	<tItLe>testing</tItLe>
<link rel="stylesheet" href="styles.css"></hEaD>
<CoDe ClAsS="lAnGuAgE-fOo"></CoDe>
</hTmL>`);
});