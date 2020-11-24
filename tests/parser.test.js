const test = require('ava');
const parser = require('../components/options-parser.js');


test('Accepts boolean removeRedundancy option', t => {
	t.true(parser({removeRedundancy:true}).removeRedundancy);
	t.false(parser({removeRedundancy:false}).removeRedundancy);
});

test('Ignores non-boolean removeRedundancy options', t => {
	t.false(parser({removeRedundancy:null}).hasOwnProperty('removeRedundancy'));
	t.false(parser({removeRedundancy:undefined}).hasOwnProperty('removeRedundancy'));
	t.false(parser({removeRedundancy:123}).hasOwnProperty('removeRedundancy'));
	t.false(parser({removeRedundancy:'foo'}).hasOwnProperty('removeRedundancy'));
	t.false(parser({removeRedundancy:['foo','bar']}).hasOwnProperty('removeRedundancy'));
	t.false(parser({removeRedundancy:{foo:'bar'}}).hasOwnProperty('removeRedundancy'));
	t.false(parser({removeRedundancy:function(foo) {return bar;}}).hasOwnProperty('removeRedundancy'));
});


test('Accepts valid styles options', t => {
	t.is(parser({styles:'foo'}).styles[0].tag, 'link');
	t.is(parser({styles:'foo'}).styles[0].attrs.rel, 'stylesheet');
	t.is(parser({styles:'foo'}).styles[0].attrs.href, 'foo');

	t.is(parser({styles:{foo: 'bar'}}).styles[0].tag, 'link');
	t.is(parser({styles:{foo: 'bar'}}).styles[0].attrs.rel, 'stylesheet');
	t.is(parser({styles:{foo: 'bar'}}).styles[0].attrs.foo, 'bar');
});

test('Ignores null or undefined styles options', t => {
	t.false(parser({styles:null}).hasOwnProperty('styles'));
	t.false(parser({styles:undefined}).hasOwnProperty('styles'));
});

test('Rejects invalid styles options', t => {
	t.throws(()=> {parser({styles:true})});
	t.throws(()=> {parser({styles:false})});
	t.throws(()=> {parser({styles:123})});
	t.throws(()=> {parser({styles:function(foo){return bar;}})});
	t.throws(()=> {parser({styles:['foo', 123]})});
});