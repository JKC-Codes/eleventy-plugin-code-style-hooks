module.exports = [
	{
		language: 'html',
		code:
`<p>foo <em>bar</em> baz</p>`
	},

	{
		language: 'css',
		code:
`.foo {
	bar: baz;
}`
	},

	{
		language: 'javascript',
		code:
`function foo(bar) {
	return baz;
}`
	},

	{
		language: 'shell',
		code:
`$ echo '#! /foo/bar/baz'`
	},

	{
		language: 'none',
		code:
`language none`
	},

	{
		language: '',
		code:
`no class name`
	},

	{
		language: 'hTmL',
		code:
`<p>hTmL</p>`
	},
]