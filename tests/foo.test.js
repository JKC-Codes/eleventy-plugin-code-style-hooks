const test = require('ava');
const foo = require('../components/bar.js');


test('is throw placeholder', t => {
	t.notThrows(()=> {
		foo()
	});
});

test('is placeholder', t => {
	t.is(foo(), 'bar');
});