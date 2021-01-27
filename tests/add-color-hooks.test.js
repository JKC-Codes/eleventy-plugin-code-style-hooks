const test = require('ava');
const addHooks = require('../components/add-hooks.js');

function addColorHooks(string, options) {
	options = Object.assign(
		{},
		{
			language: 'css',
			highlightSyntax: true,
			showColors: true
		},
		options
	);

	return addHooks(string, options).replace(/&lt;/g, '<');
}

function findsColor(string, ...colors) {
	return colors.every(color => {
		return addColorHooks(string).includes(addColorHooks(color));
	});
}

function hasColorHooks(string) {
	return addColorHooks(string).includes('<span class="token color">');
}


function addsHooks(string, colorFunction, numberCount = 3, alphaPunctuation = false) {
	const stringWithHooks = addColorHooks(string);
	const punctuationCount = (stringWithHooks.match(/,/g)?.length / 2 + 2 || 2) + (alphaPunctuation ? 1 : 0);
	const unitCount = stringWithHooks.match(/(%|deg|g?rad|turn)/gi)?.length / 2 || 0;
	const start = new RegExp(String.raw`^<span class="token color"><span class="color-preview" style="--color-value: ${colorFunction}\([^)]*\)" aria-hidden="true"><\/span><span class="token function">${colorFunction}<\/span><span class="token punctuation">\(<\/span>`).test(stringWithHooks);
	const end = stringWithHooks.endsWith('</span>');
	const numbers = stringWithHooks.match(/<span class="token number">/g).length === numberCount;
	const punctuation = stringWithHooks.match(/<span class="token punctuation">/g).length === punctuationCount;
	const units = (stringWithHooks.match(/<span class="token unit">/g)?.length || 0) === unitCount;

	return start && end && numbers && punctuation && units;
}


test('Adds hex colour hooks', t => {
	t.is(addColorHooks('#0AF'), '<span class="token color"><span class="color-preview" style="--color-value: #0AF" aria-hidden="true"></span>#0AF</span>');
	t.is(addColorHooks('#0af'), '<span class="token color"><span class="color-preview" style="--color-value: #0af" aria-hidden="true"></span>#0af</span>');
	t.is(addColorHooks('#19a0'), '<span class="token color"><span class="color-preview" style="--color-value: #19a0" aria-hidden="true"></span>#19a0</span>');
	t.is(addColorHooks('#2fa911'), '<span class="token color"><span class="color-preview" style="--color-value: #2fa911" aria-hidden="true"></span>#2fa911</span>');
	t.is(addColorHooks('#d67326cc'), '<span class="token color"><span class="color-preview" style="--color-value: #d67326cc" aria-hidden="true"></span>#d67326cc</span>');
});


test('Can find hex colour within text', t => {
	t.true(findsColor('color:#fff;', '#fff'));
	t.true(findsColor('color: #fff', '#fff'));
	t.true(findsColor('background: linear-gradient(#fff, #000);', '#fff', '#000'));
});


test('Ignores invalid hex colours', t => {
	t.false(hasColorHooks('a#fff'));
	t.false(hasColorHooks('#-fff'));
	t.false(hasColorHooks('#g1f'));
	t.false(hasColorHooks('#fffg'));
	t.false(hasColorHooks('#fff00'));
	t.false(hasColorHooks('#4325aff'));
});


test('Adds RGB colour hooks', t => {
	t.true(addsHooks('rgb(100,200,300)', 'rgb'));
	t.true(addsHooks('RGB(100,200,300)', 'RGB'));
	t.true(addsHooks('rgb(100, 200, 300)', 'rgb'));
	t.true(addsHooks('rgb(100 200 300)', 'rgb'));
	t.true(addsHooks('rgb( 100 200 300 )', 'rgb'));

	t.true(addsHooks('rgb(10%,50%,90%)', 'rgb'));
	t.true(addsHooks('rgb(10%, 40%, 99%)', 'rgb'));
	t.true(addsHooks('rgb(12% 55% 11%)', 'rgb'));

	t.true(addsHooks('rgb(100,200,300,0.61)', 'rgb', 4));
	t.true(addsHooks('rgb(100, 200, 300, 0.7)', 'rgb', 4));
	t.true(addsHooks('rgb(100 200 300 / 0.8)', 'rgb', 4, true));
	t.true(addsHooks('rgb(100 200 300 /0.9)', 'rgb', 4, true));
	t.true(addsHooks('rgb(100 200 300/1)', 'rgb', 4, true));

	t.true(addsHooks('rgba(100,200,300,0.61)', 'rgba', 4));
	t.true(addsHooks('rgba(100, 200, 300, 0.7)', 'rgba', 4));
	t.true(addsHooks('rgba(100 200 300 / 0.8)', 'rgba', 4, true));
	t.true(addsHooks('rgba(100 200 300 /0.9)', 'rgba', 4, true));
	t.true(addsHooks('rgba(100 200 300/1)', 'rgba', 4, true));

	t.true(addsHooks('rgb(99%,32%,68%,0.61)', 'rgb', 4));
	t.true(addsHooks('rgb(99%, 32%, 68%, 0.7)', 'rgb', 4));
	t.true(addsHooks('rgb(99%, 32%, 68%, 70%)', 'rgb', 4));
	t.true(addsHooks('rgb(99% 32% 68% / 0.8)', 'rgb', 4, true));
	t.true(addsHooks('rgb(99% 32% 68% /0.9)', 'rgb', 4, true));
	t.true(addsHooks('rgb(99% 32% 68%/1)', 'rgb', 4, true));
	t.true(addsHooks('rgb(99% 32% 68%/100%)', 'rgb', 4, true));

	t.true(addsHooks('rgba(99%,32%,68%,0.61)', 'rgba', 4));
	t.true(addsHooks('rgba(99%, 32%, 68%, 0.7)', 'rgba', 4));
	t.true(addsHooks('rgba(99% 32% 68% / 0.8)', 'rgba', 4, true));
	t.true(addsHooks('rgba(99% 32% 68% /0.9)', 'rgba', 4, true));
	t.true(addsHooks('rgba(99% 32% 68%/1)', 'rgba', 4, true));

	t.is(addColorHooks('rgb(255,255,255)'), '<span class="token color"><span class="color-preview" style="--color-value: rgb(255,255,255)" aria-hidden="true"></span><span class="token function">rgb</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">,</span><span class="token number">255</span><span class="token punctuation">,</span><span class="token number">255</span><span class="token punctuation">)</span></span>');
	t.is(addColorHooks('rgba(100%,100%,100%/50%)'), '<span class="token color"><span class="color-preview" style="--color-value: rgba(100%,100%,100%/50%)" aria-hidden="true"></span><span class="token function">rgba</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token unit">%</span><span class="token punctuation">,</span><span class="token number">100</span><span class="token unit">%</span><span class="token punctuation">,</span><span class="token number">100</span><span class="token unit">%</span><span class="token punctuation">/</span><span class="token number">50</span><span class="token unit">%</span><span class="token punctuation">)</span></span>');
});


test('Can find rgb colour within text', t => {
	t.true(findsColor('color:rgb(255,255,255);', 'rgb(255,255,255)'));
	t.true(findsColor('color: rgb(255,255,255)', 'rgb(255,255,255)'));
	t.true(findsColor('background: linear-gradient(rgb(255,255,255), rgb(0,0,0));', 'rgb(255,255,255)', 'rgb(0,0,0)'));
});


test('Ignores invalid RGB colours', t => {
	t.false(hasColorHooks('argb(255,255,255)'));
	t.false(hasColorHooks('rgb(255,255,255)a'));
	t.false(hasColorHooks('rgbb(255,255,255)'));
	t.false(hasColorHooks('rgb(a,255,255)'));

	t.false(hasColorHooks('argb(1%,1%,1%)'));
	t.false(hasColorHooks('rgb(1%,1%,1%)a'));
	t.false(hasColorHooks('rgbb(1%,1%,1%)'));
	t.false(hasColorHooks('rgb(a,1%,1%)'));
});


test('Adds HSL colour hooks', t => {
	t.true(addsHooks('hsl(255,50%,100%)', 'hsl'));
	t.true(addsHooks('HSL(255,50%,100%)', 'HSL'));
	t.true(addsHooks('hsl(255, 50%, 100%)', 'hsl'));
	t.true(addsHooks('hsl(255 50% 100%)', 'hsl'));

	t.true(addsHooks('hsl(255,50%,100%,0.9)', 'hsl', 4));
	t.true(addsHooks('hsl(255,50%,100%,0.9%)', 'hsl', 4));
	t.true(addsHooks('hsl(255,50%,100%, 0.45)', 'hsl', 4));
	t.true(addsHooks('hsl(255,50%,100%, 0.45%)', 'hsl', 4));
	t.true(addsHooks('hsl(255,50%,100%/100)', 'hsl', 4, true));
	t.true(addsHooks('hsl(255,50%,100%/100%)', 'hsl', 4, true));
	t.true(addsHooks('hsl(255,50%,100% / 1)', 'hsl', 4, true));
	t.true(addsHooks('hsl(255,50%,100% / 1%)', 'hsl', 4, true));

	t.true(addsHooks('hsla(255,50%,100%,0.9)', 'hsla', 4));
	t.true(addsHooks('hsla(255,50%,100%,0.9%)', 'hsla', 4));
	t.true(addsHooks('hsla(255,50%,100%, 0.45)', 'hsla', 4));
	t.true(addsHooks('hsla(255,50%,100%, 0.45%)', 'hsla', 4));
	t.true(addsHooks('hsla(255,50%,100%/100)', 'hsla', 4, true));
	t.true(addsHooks('hsla(255,50%,100%/100%)', 'hsla', 4, true));
	t.true(addsHooks('hsla(255,50%,100% / 1)', 'hsla', 4, true));
	t.true(addsHooks('hsla(255,50%,100% / 1%)', 'hsla', 4, true));

	t.true(addsHooks('hsl(400deg,50%,100%)', 'hsl'));
	t.true(addsHooks('hsl(50grad,50%,100%)', 'hsl'));
	t.true(addsHooks('hsl(3.1416rad,50%,100%)', 'hsl'));
	t.true(addsHooks('hsl(0.75turn,50%,100%)', 'hsl'));
	t.true(addsHooks('hsl(.75turn,50%,100%)', 'hsl'));

	t.is(addColorHooks('hsl(255,50%,100%)'), '<span class="token color"><span class="color-preview" style="--color-value: hsl(255,50%,100%)" aria-hidden="true"></span><span class="token function">hsl</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">,</span><span class="token number">50</span><span class="token unit">%</span><span class="token punctuation">,</span><span class="token number">100</span><span class="token unit">%</span><span class="token punctuation">)</span></span>');
	t.is(addColorHooks('hsl(360deg,100%,50%)'), '<span class="token color"><span class="color-preview" style="--color-value: hsl(360deg,100%,50%)" aria-hidden="true"></span><span class="token function">hsl</span><span class="token punctuation">(</span><span class="token number">360</span><span class="token unit">deg</span><span class="token punctuation">,</span><span class="token number">100</span><span class="token unit">%</span><span class="token punctuation">,</span><span class="token number">50</span><span class="token unit">%</span><span class="token punctuation">)</span></span>');
});


test('Can find hsl colour within text', t => {
	t.true(findsColor('color:hsl(255,50%,100%);', 'hsl(255,50%,100%)'));
	t.true(findsColor('color: hsl(255,50%,100%)', 'hsl(255,50%,100%)'));
	t.true(findsColor('background: linear-gradient(hsl(255,50%,100%), hsl(0,100%,50%));', 'hsl(255,50%,100%)', 'hsl(0,100%,50%)'));
});


test('Ignores invalid HSL colours', t => {
	t.false(hasColorHooks('ahsl(255,50%,100%)'));
	t.false(hasColorHooks('hslb(255,50%,100%)'));
	t.false(hasColorHooks('hsl(255,50%,100%)a'));

	t.false(hasColorHooks('hsl(a,50%,100%)'));
	t.false(hasColorHooks('hsl(100turns,50%,100%)'));
	t.false(hasColorHooks('hsl(100turns,50,100%)'));
});


test('Adds HWB colour hooks', t => {
	t.true(addsHooks('hwb(180 50% 100%)', 'hwb'));
	t.true(addsHooks('HWB(180 50% 100%)', 'HWB'));
	t.true(addsHooks('hwb(180 -50% 100%)', 'hwb'));

	t.true(addsHooks('hwb(45deg 20% 86%)', 'hwb'));
	t.true(addsHooks('hwb(40grad 56% 12%)', 'hwb'));
	t.true(addsHooks('hwb(3.1416rad 87% 3%)', 'hwb'));
	t.true(addsHooks('hwb(0.8turn 99% 13%)', 'hwb'));
	t.true(addsHooks('hwb(.8turn 4% 87%)', 'hwb'));

	t.true(addsHooks('hwb(180 50% 100%/0.9)', 'hwb', 4, true));
	t.true(addsHooks('hwb(180 50% 100%/37%)', 'hwb', 4, true));
	t.true(addsHooks('hwb(180 50% 100% / 0.9)', 'hwb', 4, true));
	t.true(addsHooks('hwb(180 50% 100% / 37%)', 'hwb', 4, true));

	t.is(addColorHooks('hwb(180 50% 100%)'), '<span class="token color"><span class="color-preview" style="--color-value: hwb(180 50% 100%)" aria-hidden="true"></span><span class="token function">hwb</span><span class="token punctuation">(</span><span class="token number">180</span> <span class="token number">50</span><span class="token unit">%</span> <span class="token number">100</span><span class="token unit">%</span><span class="token punctuation">)</span></span>');
	t.is(addColorHooks('hwb(360deg 100% 50%)'), '<span class="token color"><span class="color-preview" style="--color-value: hwb(360deg 100% 50%)" aria-hidden="true"></span><span class="token function">hwb</span><span class="token punctuation">(</span><span class="token number">360</span><span class="token unit">deg</span> <span class="token number">100</span><span class="token unit">%</span> <span class="token number">50</span><span class="token unit">%</span><span class="token punctuation">)</span></span>');
});


test('Can find hwb colour within text', t => {
	t.true(findsColor('color:hwb(180 50% 100%);', 'hwb(180 50% 100%)'));
	t.true(findsColor('color: hwb(180 50% 100%)', 'hwb(180 50% 100%)'));
	t.true(findsColor('background: linear-gradient(hwb(180 50% 100%), hwb(0 100% 50%));', 'hwb(180 50% 100%)', 'hwb(0 100% 50%)'));
});


test('Ignores invalid HWB colours', t => {
	t.false(hasColorHooks('ahwb(180 50% 100%)'));
	t.false(hasColorHooks('hwba(180 50% 100%)'));
	t.false(hasColorHooks('hwb(180 50% 100%)a'));

	t.false(hasColorHooks('hwb(180% 50% 100%)'));
	t.false(hasColorHooks('hwb(180 50 100)'));
	t.false(hasColorHooks('hwb(0.5turns 50% 100%)'));
	t.false(hasColorHooks('hwb(180 50% 100% 0.9)'));
	t.false(hasColorHooks('hwb(180 50% 100% / a)'));
});


test('Adds Lab colour hooks', t => {
	t.true(addsHooks('lab(50% 10 90)', 'lab'));
	t.true(addsHooks('LAB(50% 10 90)', 'LAB'));
	t.true(addsHooks('lab(50% -10 90)', 'lab'));

	t.true(addsHooks('lab(50% -10 90/0.9)', 'lab', 4, true));
	t.true(addsHooks('lab(50% -10 90/37%)', 'lab', 4, true));
	t.true(addsHooks('lab(50% -10 90 / 0.9)', 'lab', 4, true));
	t.true(addsHooks('lab(50% -10 90 / 37%)', 'lab', 4, true));

	t.is(addColorHooks('lab(50% 10 90)'), '<span class="token color"><span class="color-preview" style="--color-value: lab(50% 10 90)" aria-hidden="true"></span><span class="token function">lab</span><span class="token punctuation">(</span><span class="token number">50</span><span class="token unit">%</span> <span class="token number">10</span> <span class="token number">90</span><span class="token punctuation">)</span></span>');
	t.is(addColorHooks('lab(0% 500 0.24/.9)'), '<span class="token color"><span class="color-preview" style="--color-value: lab(0% 500 0.24/.9)" aria-hidden="true"></span><span class="token function">lab</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token unit">%</span> <span class="token number">500</span> <span class="token number">0.24</span><span class="token punctuation">/</span><span class="token number">.9</span><span class="token punctuation">)</span></span>');
});


test('Can find lab colour within text', t => {
	t.true(findsColor('color:lab(50% 10 90);', 'lab(50% 10 90)'));
	t.true(findsColor('color: lab(50% 10 90)', 'lab(50% 10 90)'));
	t.true(findsColor('background: linear-gradient(lab(50% 10 90), lab(75% 50 100));', 'lab(50% 10 90)', 'lab(75% 50 100)'));
});


test('Ignores invalid Lab colours', t => {
	t.false(hasColorHooks('alab(50% 10 90)'));
	t.false(hasColorHooks('laba(50% 10 90)'));
	t.false(hasColorHooks('lab(50% 10 90)a'));

	t.false(hasColorHooks('lab(50 10 90)'));
	t.false(hasColorHooks('lab(50% 10% 90)'));
	t.false(hasColorHooks('lab(50% 10% 90 0.9)'));
	t.false(hasColorHooks('lab(50% 10 90 / a)'));
});


test('Adds LCH colour hooks', t => {
	t.true(addsHooks('lch(50% 10 90)', 'lch'));
	t.true(addsHooks('LCH(50% 10 90)', 'LCH'));
	t.true(addsHooks('lch(50% -10 90)', 'lch'));

	t.true(addsHooks('lch(50% 10 45deg)', 'lch'));
	t.true(addsHooks('lch(50% 10 40grad)', 'lch'));
	t.true(addsHooks('lch(50% 10 3.1416rad)', 'lch'));
	t.true(addsHooks('lch(50% 10 0.8turn)', 'lch'));
	t.true(addsHooks('lch(50% 10 .8turn)', 'lch'));

	t.true(addsHooks('lch(50% -10 90/0.9)', 'lch', 4, true));
	t.true(addsHooks('lch(50% -10 90/37%)', 'lch', 4, true));
	t.true(addsHooks('lch(50% -10 90 / 0.9)', 'lch', 4, true));
	t.true(addsHooks('lch(50% -10 90 / 37%)', 'lch', 4, true));

	t.is(addColorHooks('lch(50% 10 90)'), '<span class="token color"><span class="color-preview" style="--color-value: lch(50% 10 90)" aria-hidden="true"></span><span class="token function">lch</span><span class="token punctuation">(</span><span class="token number">50</span><span class="token unit">%</span> <span class="token number">10</span> <span class="token number">90</span><span class="token punctuation">)</span></span>');
	t.is(addColorHooks('lch(0% 500 0.24/.9)'), '<span class="token color"><span class="color-preview" style="--color-value: lch(0% 500 0.24/.9)" aria-hidden="true"></span><span class="token function">lch</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token unit">%</span> <span class="token number">500</span> <span class="token number">0.24</span><span class="token punctuation">/</span><span class="token number">.9</span><span class="token punctuation">)</span></span>');
});


test('Can find lch colour within text', t => {
	t.true(findsColor('color:lch(50% 10 90);', 'lch(50% 10 90)'));
	t.true(findsColor('color: lch(50% 10 90)', 'lch(50% 10 90)'));
	t.true(findsColor('background: linear-gradient(lch(50% 10 90), lch(75% 50 100));', 'lch(50% 10 90)', 'lch(75% 50 100)'));
});


test('Ignores invalid LCH colours', t => {
	t.false(hasColorHooks('alch(50% 10 90)'));
	t.false(hasColorHooks('lcha(50% 10 90)'));
	t.false(hasColorHooks('lch(50% 10 90)a'));

	t.false(hasColorHooks('lch(50 10 90)'));
	t.false(hasColorHooks('lch(50% 10% 90)'));
	t.false(hasColorHooks('lch(50% 10 0.5turns)'));
	t.false(hasColorHooks('lch(50% 10% 90 0.9)'));
	t.false(hasColorHooks('lch(50% 10 90 / a)'));
});