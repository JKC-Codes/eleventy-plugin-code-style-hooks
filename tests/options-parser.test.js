const test = require('ava');
const parser = require('../components/options-parser.js');


test('Accepts valid defaultLanguage options', t => {
	t.like(parser({defaultLanguage: 'foo'}), {defaultLanguage: 'foo'});
	t.like(parser({defaultLanguage: 'inform7'}), {defaultLanguage: 'inform7'});
	t.like(parser({defaultLanguage: 'nand2tetris-hdl'}), {defaultLanguage: 'nand2tetris-hdl'});
});


test('Converts defaultLanguage option to lower case', t => {
	t.like(parser({defaultLanguage: 'HTML'}), {defaultLanguage: 'html'});
	t.like(parser({defaultLanguage: 'CSS'}), {defaultLanguage: 'css'});
	t.like(parser({defaultLanguage: 'javaScript'}), {defaultLanguage: 'javascript'});
});


test('Rejects invalid defaultLanguage options', t => {
	t.throws(()=> {parser({defaultLanguage: true})});
	t.throws(()=> {parser({defaultLanguage: false})});
	t.throws(()=> {parser({defaultLanguage: 123})});
	t.throws(()=> {parser({defaultLanguage: ['foo', 123]})});
	t.throws(()=> {parser({defaultLanguage: {foo: 'bar'}})});
	t.throws(()=> {parser({defaultLanguage: function(foo) {return 'bar';}})});
});


test('Accepts boolean highlightSyntax option', t => {
	t.true(parser({highlightSyntax: true}).highlightSyntax);
	t.false(parser({highlightSyntax: false}).highlightSyntax);
});


test('Rejects non-boolean highlightSyntax options', t => {
	t.throws(()=> {parser({highlightSyntax: 123})});
	t.throws(()=> {parser({highlightSyntax: 'foo'})});
	t.throws(()=> {parser({highlightSyntax: ['foo', 123]})});
	t.throws(()=> {parser({highlightSyntax: {foo: 'bar'}})});
	t.throws(()=> {parser({highlightSyntax: function(foo) {return 'bar';}})});
});


test('Accepts boolean removeRedundancy option', t => {
	t.true(parser({removeRedundancy: true}).removeRedundancy);
	t.false(parser({removeRedundancy: false}).removeRedundancy);
});


test('Rejects non-boolean removeRedundancy options', t => {
	t.throws(()=> {parser({removeRedundancy: 123})});
	t.throws(()=> {parser({removeRedundancy: 'foo'})});
	t.throws(()=> {parser({removeRedundancy: ['foo', 123]})});
	t.throws(()=> {parser({removeRedundancy: {foo: 'bar'}})});
	t.throws(()=> {parser({removeRedundancy: function(foo) {return 'bar';}})});
});


test('Accepts boolean colorPreviews option', t => {
	t.true(parser({colorPreviews: true}).colorPreviews);
	t.false(parser({colorPreviews: false}).colorPreviews);
});


test('Rejects non-boolean colorPreviews options', t => {
	t.throws(()=> {parser({colorPreviews: 123})});
	t.throws(()=> {parser({colorPreviews: 'foo'})});
	t.throws(()=> {parser({colorPreviews: ['foo', 123]})});
	t.throws(()=> {parser({colorPreviews: {foo: 'bar'}})});
	t.throws(()=> {parser({colorPreviews: function(foo) {return 'bar';}})});
});


test('Accepts boolean languageLabels option', t => {
	t.true(parser({languageLabels: true}).languageLabels);
	t.false(parser({languageLabels: false}).languageLabels);
});


test('Rejects non-boolean languageLabels options', t => {
	t.throws(()=> {parser({languageLabels: 123})});
	t.throws(()=> {parser({languageLabels: 'foo'})});
	t.throws(()=> {parser({languageLabels: ['foo', 123]})});
	t.throws(()=> {parser({languageLabels: {foo: 'bar'}})});
	t.throws(()=> {parser({languageLabels: function(foo) {return 'bar';}})});
});


test('Accepts boolean lineNumbers option', t => {
	t.true(parser({lineNumbers: true}).lineNumbers);
	t.false(parser({lineNumbers: false}).lineNumbers);
});


test('Rejects non-boolean lineNumbers options', t => {
	t.throws(()=> {parser({lineNumbers: 123})});
	t.throws(()=> {parser({lineNumbers: 'foo'})});
	t.throws(()=> {parser({lineNumbers: ['foo', 123]})});
	t.throws(()=> {parser({lineNumbers: {foo: 'bar'}})});
	t.throws(()=> {parser({lineNumbers: function(foo) {return 'bar';}})});
});


test('Accepts valid styles options', t => {
	t.is(parser({styles: 'foo'}).styles[0].tag, 'link');
	t.is(parser({styles: 'foo'}).styles[0].attrs.rel, 'stylesheet');
	t.is(parser({styles: 'foo'}).styles[0].attrs.href, 'foo');

	t.is(parser({styles: {foo: 'bar'}}).styles[0].tag, 'link');
	t.is(parser({styles: {foo: 'bar'}}).styles[0].attrs.rel, 'stylesheet');
	t.is(parser({styles: {foo: 'bar'}}).styles[0].attrs.foo, 'bar');

	t.is(parser({styles: ['foo', 'bar']}).styles[0].tag, 'link');
	t.is(parser({styles: ['foo', 'bar']}).styles[0].attrs.rel, 'stylesheet');
	t.is(parser({styles: ['foo', 'bar']}).styles[0].attrs.href, 'foo');
	t.is(parser({styles: ['foo', 'bar']}).styles[1].tag, 'link');
	t.is(parser({styles: ['foo', 'bar']}).styles[1].attrs.rel, 'stylesheet');
	t.is(parser({styles: ['foo', 'bar']}).styles[1].attrs.href, 'bar');

	t.is(parser({styles: [{foo: 'bar'}, 'foo']}).styles[0].tag, 'link');
	t.is(parser({styles: [{foo: 'bar'}, 'foo']}).styles[0].attrs.rel, 'stylesheet');
	t.is(parser({styles: [{foo: 'bar'}, 'foo']}).styles[0].attrs.foo, 'bar');
	t.is(parser({styles: [{foo: 'bar'}, 'foo']}).styles[1].tag, 'link');
	t.is(parser({styles: [{foo: 'bar'}, 'foo']}).styles[1].attrs.rel, 'stylesheet');
	t.is(parser({styles: [{foo: 'bar'}, 'foo']}).styles[1].attrs.href, 'foo');
});


test('Rejects invalid styles options', t => {
	t.throws(()=> {parser({styles: true})});
	t.throws(()=> {parser({styles: false})});
	t.throws(()=> {parser({styles: 123})});
	t.throws(()=> {parser({styles: function(foo) {return 'bar';}})});
	t.throws(()=> {parser({styles: ['foo', 123]})});
});


test('Accepts valid scripts options', t => {
	t.is(parser({scripts: 'foo'}).scripts[0].tag, 'script');
	t.is(parser({scripts: 'foo'}).scripts[0].attrs.src, 'foo');

	t.is(parser({scripts: {foo: 'bar'}}).scripts[0].tag, 'script');
	t.is(parser({scripts: {foo: 'bar'}}).scripts[0].attrs.foo, 'bar');

	t.is(parser({scripts: ['foo', 'bar']}).scripts[0].tag, 'script');
	t.is(parser({scripts: ['foo', 'bar']}).scripts[0].attrs.src, 'foo');
	t.is(parser({scripts: ['foo', 'bar']}).scripts[1].tag, 'script');
	t.is(parser({scripts: ['foo', 'bar']}).scripts[1].attrs.src, 'bar');

	t.is(parser({scripts: [{foo: 'bar'}, 'foo']}).scripts[0].tag, 'script');
	t.is(parser({scripts: [{foo: 'bar'}, 'foo']}).scripts[0].attrs.foo, 'bar');
	t.is(parser({scripts: [{foo: 'bar'}, 'foo']}).scripts[1].tag, 'script');
	t.is(parser({scripts: [{foo: 'bar'}, 'foo']}).scripts[1].attrs.src, 'foo');
});


test('Rejects invalid scripts options', t => {
	t.throws(()=> {parser({scripts: true})});
	t.throws(()=> {parser({scripts: false})});
	t.throws(()=> {parser({scripts: 123})});
	t.throws(()=> {parser({scripts: function(foo) {return 'bar';}})});
	t.throws(()=> {parser({scripts: ['foo', 123]})});
});


test('Accepts valid prism options', t => {
	t.is(typeof parser({prism: function(prism) {}}).prism, 'function');
});


test('Rejects invalid prism options', t => {
	t.throws(()=> {parser({prism: true})});
	t.throws(()=> {parser({prism: false})});
	t.throws(()=> {parser({prism: 123})});
	t.throws(()=> {parser({prism: 'foo'})});
	t.throws(()=> {parser({prism: ['foo', 123]})});
	t.throws(()=> {parser({prism: {foo: 'bar'}})});
});


test('Ignores null or undefined options', t => {
	t.false(parser({defaultLanguage: null}).hasOwnProperty('defaultLanguage'));
	t.false(parser({defaultLanguage: undefined}).hasOwnProperty('defaultLanguage'));

	t.false(parser({highlightSyntax: null}).hasOwnProperty('highlightSyntax'));
	t.false(parser({highlightSyntax: undefined}).hasOwnProperty('highlightSyntax'));

	t.false(parser({removeRedundancy: null}).hasOwnProperty('removeRedundancy'));
	t.false(parser({removeRedundancy: undefined}).hasOwnProperty('removeRedundancy'));

	t.false(parser({colorPreviews: null}).hasOwnProperty('colorPreviews'));
	t.false(parser({colorPreviews: undefined}).hasOwnProperty('colorPreviews'));

	t.false(parser({languageLabels: null}).hasOwnProperty('languageLabels'));
	t.false(parser({languageLabels: undefined}).hasOwnProperty('languageLabels'));

	t.false(parser({lineNumbers: null}).hasOwnProperty('lineNumbers'));
	t.false(parser({lineNumbers: undefined}).hasOwnProperty('lineNumbers'));

	t.false(parser({scripts: null}).hasOwnProperty('scripts'));
	t.false(parser({scripts: undefined}).hasOwnProperty('scripts'));

	t.false(parser({styles: null}).hasOwnProperty('styles'));
	t.false(parser({styles: undefined}).hasOwnProperty('styles'));

	t.false(parser({prism: null}).hasOwnProperty('prism'));
	t.false(parser({prism: undefined}).hasOwnProperty('prism'));
});


test('Rejects invalid options', t => {
	t.throws(()=> {parser({foo: 'bar'})});
	t.throws(()=> {parser({defaultlanguage: 'bar'})});
});