const test = require('ava');
const parser = require('../components/options-parser.js');


test('Accepts valid defaultLanguage options', t => {
	t.deepEqual(parser({defaultLanguage: 'foo'}), {defaultLanguage: 'foo'});
	t.deepEqual(parser({defaultLanguage: 'inform7'}), {defaultLanguage: 'inform7'});
	t.deepEqual(parser({defaultLanguage: 'nand2tetris-hdl'}), {defaultLanguage: 'nand2tetris-hdl'});
});


test('Converts defaultLanguage option to lower case', t => {
	t.deepEqual(parser({defaultLanguage: 'HTML'}), {defaultLanguage: 'html'});
	t.deepEqual(parser({defaultLanguage: 'CSS'}), {defaultLanguage: 'css'});
	t.deepEqual(parser({defaultLanguage: 'javaScript'}), {defaultLanguage: 'javascript'});
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


test('Accepts boolean showColors option', t => {
	t.true(parser({showColors: true}).showColors);
	t.false(parser({showColors: false}).showColors);
});


test('Rejects non-boolean showColors options', t => {
	t.throws(()=> {parser({showColors: 123})});
	t.throws(()=> {parser({showColors: 'foo'})});
	t.throws(()=> {parser({showColors: ['foo', 123]})});
	t.throws(()=> {parser({showColors: {foo: 'bar'}})});
	t.throws(()=> {parser({showColors: function(foo) {return 'bar';}})});
});


test('Accepts boolean showLanguages option', t => {
	t.true(parser({showLanguages: true}).showLanguages);
	t.false(parser({showLanguages: false}).showLanguages);
});


test('Rejects non-boolean showLanguages options', t => {
	t.throws(()=> {parser({showLanguages: 123})});
	t.throws(()=> {parser({showLanguages: 'foo'})});
	t.throws(()=> {parser({showLanguages: ['foo', 123]})});
	t.throws(()=> {parser({showLanguages: {foo: 'bar'}})});
	t.throws(()=> {parser({showLanguages: function(foo) {return 'bar';}})});
});


test('Accepts boolean showLineNumbers option', t => {
	t.true(parser({showLineNumbers: true}).showLineNumbers);
	t.false(parser({showLineNumbers: false}).showLineNumbers);
});


test('Rejects non-boolean showLineNumbers options', t => {
	t.throws(()=> {parser({showLineNumbers: 123})});
	t.throws(()=> {parser({showLineNumbers: 'foo'})});
	t.throws(()=> {parser({showLineNumbers: ['foo', 123]})});
	t.throws(()=> {parser({showLineNumbers: {foo: 'bar'}})});
	t.throws(()=> {parser({showLineNumbers: function(foo) {return 'bar';}})});
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


test('Ignores null or undefined options', t => {
	t.false(parser({defaultLanguage: null}).hasOwnProperty('defaultLanguage'));
	t.false(parser({defaultLanguage: undefined}).hasOwnProperty('defaultLanguage'));

	t.false(parser({highlightSyntax: null}).hasOwnProperty('highlightSyntax'));
	t.false(parser({highlightSyntax: undefined}).hasOwnProperty('highlightSyntax'));

	t.false(parser({removeRedundancy: null}).hasOwnProperty('removeRedundancy'));
	t.false(parser({removeRedundancy: undefined}).hasOwnProperty('removeRedundancy'));

	t.false(parser({showColors: null}).hasOwnProperty('showColors'));
	t.false(parser({showColors: undefined}).hasOwnProperty('showColors'));

	t.false(parser({showLanguages: null}).hasOwnProperty('showLanguages'));
	t.false(parser({showLanguages: undefined}).hasOwnProperty('showLanguages'));

	t.false(parser({showLineNumbers: null}).hasOwnProperty('showLineNumbers'));
	t.false(parser({showLineNumbers: undefined}).hasOwnProperty('showLineNumbers'));

	t.false(parser({scripts: null}).hasOwnProperty('scripts'));
	t.false(parser({scripts: undefined}).hasOwnProperty('scripts'));

	t.false(parser({styles: null}).hasOwnProperty('styles'));
	t.false(parser({styles: undefined}).hasOwnProperty('styles'));
});


test('Rejects invalid options', t => {
	t.throws(()=> {parser({foo: 'bar'})});
	t.throws(()=> {parser({defaultlanguage: 'bar'})});
});