const test = require('ava');
const PostHTML = require('posthtml');
const { posthtml, parser } = require('../index.js');

const defaultOptions = {
	defaultLanguage: null,
	highlightSyntax: true,
	markdownTrimTrailingNewline: true,
	removeRedundancy: true,
	colorPreviews: true,
	languageLabels: true,
	lineNumbers: true,
	scripts: [],
	styles: []
};


function addCodeHooks(HTMLString, options) {
	return PostHTML([posthtml(options)])
		.process(HTMLString)
		.then(result => result.html);
}


test('Can be used directly with PostHTML', async t => {
	return addCodeHooks('<code class="language-js"></code>')
	.then(result => {
		t.is(result, '<code class="language-js" data-language="js"></code>');
	});
});


test('Can be used with custom options by PostHTML', async t => {
	return addCodeHooks('<code></code>', {defaultLanguage: 'js'})
	.then(result => {
		t.is(result, '<code class="language-js" data-language="js"></code>');
	});
});


test.only('Can combine PostHTML and options parser', async t => {
	return addCodeHooks('<code></code>', {
		...defaultOptions,
		parsed: true,
		scripts: [{
			attrs: {
				src: 'foo.js'
			},
			tag: 'script'
		}]
	})
	.then(result => {
		t.is(result, '<script src="foo.js"></script><code></code>');
	});
});


test('Can use options parser separately', t => {
	t.deepEqual(parser(), {
		...defaultOptions,
		parsed: true,
		usingPostHTML: true
	});

	t.deepEqual(parser({defaultLanguage: 'foo'}), {
		...defaultOptions,
		parsed: true,
		usingPostHTML: true,
		defaultLanguage: 'foo'
	});

	t.deepEqual(parser({highlightSyntax: false}), {
		...defaultOptions,
		parsed: true,
		usingPostHTML: true,
		highlightSyntax: false
	});

	t.deepEqual(parser({removeRedundancy: false}), {
		...defaultOptions,
		parsed: true,
		usingPostHTML: true,
		removeRedundancy: false
	});

	t.deepEqual(parser({colorPreviews: false}), {
		...defaultOptions,
		parsed: true,
		usingPostHTML: true,
		colorPreviews: false
	});

	t.deepEqual(parser({languageLabels: false}), {
		...defaultOptions,
		parsed: true,
		usingPostHTML: true,
		languageLabels: false
	});

	t.deepEqual(parser({lineNumbers: false}), {
		...defaultOptions,
		parsed: true,
		usingPostHTML: true,
		lineNumbers: false
	});

	t.deepEqual(parser({scripts: 'foo.js'}), {
		...defaultOptions,
		parsed: true,
		usingPostHTML: true,
		scripts: [{
			attrs: {
				src: 'foo.js'
			},
			tag: 'script'
		}]
	});

	t.deepEqual(parser({styles: 'foo.css'}), {
		...defaultOptions,
		parsed: true,
		usingPostHTML: true,
		styles: [{
			attrs: {
				href: 'foo.css',
				rel: 'stylesheet'
			},
			tag: 'link'
		}]
	});
});