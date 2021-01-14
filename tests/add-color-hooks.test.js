const test = require('ava');
const walkTree = require('../components/walk-tree.js');
const parseHTML = require('posthtml-parser');
const renderHTML = require('posthtml-render');


function addColourHooks(HTMLString, options) {
	options = Object.assign(
		{
			defaultLanguage: 'none',
			highlightSyntax: false,
			removeRedundancy: false,
			showColors: true,
			showLanguages: false,
			showLineNumbers: false,
			usingPostHTML: false,
			scripts: [],
			styles: []
		},
		options
	);

	return renderHTML(walkTree(options)(parseHTML(HTMLString)));
}


test('Adds hex colour hooks', t => {
	t.is(addColourHooks('<code>#0AF</code>'), '<code><span class="token color-value" style="--color-value: #0AF" aria-hidden="true"></span>#0AF</code>');
	t.is(addColourHooks('<code>#0af</code>'), '<code><span class="token color-value" style="--color-value: #0af" aria-hidden="true"></span>#0af</code>');
	t.is(addColourHooks('<code>#19a0</code>'), '<code><span class="token color-value" style="--color-value: #19a0" aria-hidden="true"></span>#19a0</code>');
	t.is(addColourHooks('<code>#2fa911</code>'), '<code><span class="token color-value" style="--color-value: #2fa911" aria-hidden="true"></span>#2fa911</code>');
	t.is(addColourHooks('<code>#d67326cc</code>'), '<code><span class="token color-value" style="--color-value: #d67326cc" aria-hidden="true"></span>#d67326cc</code>');

	t.is(addColourHooks('<code>color:#fff;</code>'), '<code>color:<span class="token color-value" style="--color-value: #fff" aria-hidden="true"></span>#fff;</code>');
	t.is(addColourHooks('<code>color: #fff</code>'), '<code>color: <span class="token color-value" style="--color-value: #fff" aria-hidden="true"></span>#fff</code>');
	t.is(addColourHooks('<code><span>#fff</span></code>'), '<code><span><span class="token color-value" style="--color-value: #fff" aria-hidden="true"></span>#fff</span></code>');
});


test('Ignores invalid hex colours', t => {
	t.is(addColourHooks('<code>a#fff</code>'), '<code>a#fff</code>');
	t.is(addColourHooks('<code>#-fff</code>'), '<code>#-fff</code>');
	t.is(addColourHooks('<code>#g1f</code>'), '<code>#g1f</code>');
	t.is(addColourHooks('<code>#fffg</code>'), '<code>#fffg</code>');
	t.is(addColourHooks('<code>#fff00</code>'), '<code>#fff00</code>');
	t.is(addColourHooks('<code>#4325aff</code>'), '<code>#4325aff</code>');
});


test('Adds RGB colour hooks', t => {
	t.is(addColourHooks('<code>rgb(100,200,300)</code>'), '<code><span class="token color-value" style="--color-value: rgb(100,200,300)" aria-hidden="true"></span>rgb(100,200,300)</code>');
	t.is(addColourHooks('<code>RGB(100,200,300)</code>'), '<code><span class="token color-value" style="--color-value: RGB(100,200,300)" aria-hidden="true"></span>RGB(100,200,300)</code>');
	t.is(addColourHooks('<code>rgb(100, 200, 300)</code>'), '<code><span class="token color-value" style="--color-value: rgb(100, 200, 300)" aria-hidden="true"></span>rgb(100, 200, 300)</code>');
	t.is(addColourHooks('<code>rgb(100 200 300)</code>'), '<code><span class="token color-value" style="--color-value: rgb(100 200 300)" aria-hidden="true"></span>rgb(100 200 300)</code>');
	t.is(addColourHooks('<code>rgb( 100 200 300 )</code>'), '<code><span class="token color-value" style="--color-value: rgb( 100 200 300 )" aria-hidden="true"></span>rgb( 100 200 300 )</code>');

	t.is(addColourHooks('<code>rgb(10%,50%,90%)</code>'), '<code><span class="token color-value" style="--color-value: rgb(10%,50%,90%)" aria-hidden="true"></span>rgb(10%,50%,90%)</code>');
	t.is(addColourHooks('<code>rgb(10%, 40%, 99%)</code>'), '<code><span class="token color-value" style="--color-value: rgb(10%, 40%, 99%)" aria-hidden="true"></span>rgb(10%, 40%, 99%)</code>');
	t.is(addColourHooks('<code>rgb(12% 55% 11%)</code>'), '<code><span class="token color-value" style="--color-value: rgb(12% 55% 11%)" aria-hidden="true"></span>rgb(12% 55% 11%)</code>');

	t.is(addColourHooks('<code>rgb(100,200,300,0.61)</code>'), '<code><span class="token color-value" style="--color-value: rgb(100,200,300,0.61)" aria-hidden="true"></span>rgb(100,200,300,0.61)</code>');
	t.is(addColourHooks('<code>rgb(100, 200, 300, 0.7)</code>'), '<code><span class="token color-value" style="--color-value: rgb(100, 200, 300, 0.7)" aria-hidden="true"></span>rgb(100, 200, 300, 0.7)</code>');
	t.is(addColourHooks('<code>rgb(100 200 300 / 0.8)</code>'), '<code><span class="token color-value" style="--color-value: rgb(100 200 300 / 0.8)" aria-hidden="true"></span>rgb(100 200 300 / 0.8)</code>');
	t.is(addColourHooks('<code>rgb(100 200 300 /0.9)</code>'), '<code><span class="token color-value" style="--color-value: rgb(100 200 300 /0.9)" aria-hidden="true"></span>rgb(100 200 300 /0.9)</code>');
	t.is(addColourHooks('<code>rgb(100 200 300/1)</code>'), '<code><span class="token color-value" style="--color-value: rgb(100 200 300/1)" aria-hidden="true"></span>rgb(100 200 300/1)</code>');

	t.is(addColourHooks('<code>rgba(100,200,300,0.61)</code>'), '<code><span class="token color-value" style="--color-value: rgba(100,200,300,0.61)" aria-hidden="true"></span>rgba(100,200,300,0.61)</code>');
	t.is(addColourHooks('<code>rgba(100, 200, 300, 0.7)</code>'), '<code><span class="token color-value" style="--color-value: rgba(100, 200, 300, 0.7)" aria-hidden="true"></span>rgba(100, 200, 300, 0.7)</code>');
	t.is(addColourHooks('<code>rgba(100 200 300 / 0.8)</code>'), '<code><span class="token color-value" style="--color-value: rgba(100 200 300 / 0.8)" aria-hidden="true"></span>rgba(100 200 300 / 0.8)</code>');
	t.is(addColourHooks('<code>rgba(100 200 300 /0.9)</code>'), '<code><span class="token color-value" style="--color-value: rgba(100 200 300 /0.9)" aria-hidden="true"></span>rgba(100 200 300 /0.9)</code>');
	t.is(addColourHooks('<code>rgba(100 200 300/1)</code>'), '<code><span class="token color-value" style="--color-value: rgba(100 200 300/1)" aria-hidden="true"></span>rgba(100 200 300/1)</code>');

	t.is(addColourHooks('<code>rgb(99%,32%,68%,0.61)</code>'), '<code><span class="token color-value" style="--color-value: rgb(99%,32%,68%,0.61)" aria-hidden="true"></span>rgb(99%,32%,68%,0.61)</code>');
	t.is(addColourHooks('<code>rgb(99%, 32%, 68%, 0.7)</code>'), '<code><span class="token color-value" style="--color-value: rgb(99%, 32%, 68%, 0.7)" aria-hidden="true"></span>rgb(99%, 32%, 68%, 0.7)</code>');
	t.is(addColourHooks('<code>rgb(99%, 32%, 68%, 70%)</code>'), '<code><span class="token color-value" style="--color-value: rgb(99%, 32%, 68%, 70%)" aria-hidden="true"></span>rgb(99%, 32%, 68%, 70%)</code>');
	t.is(addColourHooks('<code>rgb(99% 32% 68% / 0.8)</code>'), '<code><span class="token color-value" style="--color-value: rgb(99% 32% 68% / 0.8)" aria-hidden="true"></span>rgb(99% 32% 68% / 0.8)</code>');
	t.is(addColourHooks('<code>rgb(99% 32% 68% /0.9)</code>'), '<code><span class="token color-value" style="--color-value: rgb(99% 32% 68% /0.9)" aria-hidden="true"></span>rgb(99% 32% 68% /0.9)</code>');
	t.is(addColourHooks('<code>rgb(99% 32% 68%/1)</code>'), '<code><span class="token color-value" style="--color-value: rgb(99% 32% 68%/1)" aria-hidden="true"></span>rgb(99% 32% 68%/1)</code>');
	t.is(addColourHooks('<code>rgb(99% 32% 68%/100%)</code>'), '<code><span class="token color-value" style="--color-value: rgb(99% 32% 68%/100%)" aria-hidden="true"></span>rgb(99% 32% 68%/100%)</code>');

	t.is(addColourHooks('<code>rgba(99%,32%,68%,0.61)</code>'), '<code><span class="token color-value" style="--color-value: rgba(99%,32%,68%,0.61)" aria-hidden="true"></span>rgba(99%,32%,68%,0.61)</code>');
	t.is(addColourHooks('<code>rgba(99%, 32%, 68%, 0.7)</code>'), '<code><span class="token color-value" style="--color-value: rgba(99%, 32%, 68%, 0.7)" aria-hidden="true"></span>rgba(99%, 32%, 68%, 0.7)</code>');
	t.is(addColourHooks('<code>rgba(99% 32% 68% / 0.8)</code>'), '<code><span class="token color-value" style="--color-value: rgba(99% 32% 68% / 0.8)" aria-hidden="true"></span>rgba(99% 32% 68% / 0.8)</code>');
	t.is(addColourHooks('<code>rgba(99% 32% 68% /0.9)</code>'), '<code><span class="token color-value" style="--color-value: rgba(99% 32% 68% /0.9)" aria-hidden="true"></span>rgba(99% 32% 68% /0.9)</code>');
	t.is(addColourHooks('<code>rgba(99% 32% 68%/1)</code>'), '<code><span class="token color-value" style="--color-value: rgba(99% 32% 68%/1)" aria-hidden="true"></span>rgba(99% 32% 68%/1)</code>');

	t.is(addColourHooks('<code>color:rgb(255,0,100);</code>'), '<code>color:<span class="token color-value" style="--color-value: rgb(255,0,100)" aria-hidden="true"></span>rgb(255,0,100);</code>');
	t.is(addColourHooks('<code>color: rgb(255,0,100)</code>'), '<code>color: <span class="token color-value" style="--color-value: rgb(255,0,100)" aria-hidden="true"></span>rgb(255,0,100)</code>');
	t.is(addColourHooks('<code><span>rgb(255,0,100)</span></code>'), '<code><span><span class="token color-value" style="--color-value: rgb(255,0,100)" aria-hidden="true"></span>rgb(255,0,100)</span></code>');
});


test('Ignores invalid RGB colours', t => {
	t.is(addColourHooks('<code>argb(255,255,255)</code>'), '<code>argb(255,255,255)</code>');
	t.is(addColourHooks('<code>rgb(255,255,255)a</code>'), '<code>rgb(255,255,255)a</code>');
	t.is(addColourHooks('<code>rgbb(255,255,255)</code>'), '<code>rgbb(255,255,255)</code>');
	t.is(addColourHooks('<code>rgb(a,255,255)</code>'), '<code>rgb(a,255,255)</code>');

	t.is(addColourHooks('<code>argb(1%,1%,1%)</code>'), '<code>argb(1%,1%,1%)</code>');
	t.is(addColourHooks('<code>rgb(1%,1%,1%)a</code>'), '<code>rgb(1%,1%,1%)a</code>');
	t.is(addColourHooks('<code>rgbb(1%,1%,1%)</code>'), '<code>rgbb(1%,1%,1%)</code>');
	t.is(addColourHooks('<code>rgb(a,1%,1%)</code>'), '<code>rgb(a,1%,1%)</code>');
});


test('Adds HSL colour hooks', t => {
	t.is(addColourHooks('<code>hsl(255,50%,100%)</code>'), '<code><span class="token color-value" style="--color-value: hsl(255,50%,100%)" aria-hidden="true"></span>hsl(255,50%,100%)</code>');
	t.is(addColourHooks('<code>HSL(255,50%,100%)</code>'), '<code><span class="token color-value" style="--color-value: HSL(255,50%,100%)" aria-hidden="true"></span>HSL(255,50%,100%)</code>');
	t.is(addColourHooks('<code>hsl(255, 50%, 100%)</code>'), '<code><span class="token color-value" style="--color-value: hsl(255, 50%, 100%)" aria-hidden="true"></span>hsl(255, 50%, 100%)</code>');
	t.is(addColourHooks('<code>hsl(255 50% 100%)</code>'), '<code><span class="token color-value" style="--color-value: hsl(255 50% 100%)" aria-hidden="true"></span>hsl(255 50% 100%)</code>');

	t.is(addColourHooks('<code>hsl(255,50%,100%,0.9)</code>'), '<code><span class="token color-value" style="--color-value: hsl(255,50%,100%,0.9)" aria-hidden="true"></span>hsl(255,50%,100%,0.9)</code>');
	t.is(addColourHooks('<code>hsl(255,50%,100%,0.9%)</code>'), '<code><span class="token color-value" style="--color-value: hsl(255,50%,100%,0.9%)" aria-hidden="true"></span>hsl(255,50%,100%,0.9%)</code>');
	t.is(addColourHooks('<code>hsl(255,50%,100%, 0.45)</code>'), '<code><span class="token color-value" style="--color-value: hsl(255,50%,100%, 0.45)" aria-hidden="true"></span>hsl(255,50%,100%, 0.45)</code>');
	t.is(addColourHooks('<code>hsl(255,50%,100%, 0.45%)</code>'), '<code><span class="token color-value" style="--color-value: hsl(255,50%,100%, 0.45%)" aria-hidden="true"></span>hsl(255,50%,100%, 0.45%)</code>');
	t.is(addColourHooks('<code>hsl(255,50%,100%/100)</code>'), '<code><span class="token color-value" style="--color-value: hsl(255,50%,100%/100)" aria-hidden="true"></span>hsl(255,50%,100%/100)</code>');
	t.is(addColourHooks('<code>hsl(255,50%,100%/100%)</code>'), '<code><span class="token color-value" style="--color-value: hsl(255,50%,100%/100%)" aria-hidden="true"></span>hsl(255,50%,100%/100%)</code>');
	t.is(addColourHooks('<code>hsl(255,50%,100% / 1)</code>'), '<code><span class="token color-value" style="--color-value: hsl(255,50%,100% / 1)" aria-hidden="true"></span>hsl(255,50%,100% / 1)</code>');
	t.is(addColourHooks('<code>hsl(255,50%,100% / 1%)</code>'), '<code><span class="token color-value" style="--color-value: hsl(255,50%,100% / 1%)" aria-hidden="true"></span>hsl(255,50%,100% / 1%)</code>');

	t.is(addColourHooks('<code>hsla(255,50%,100%,0.9)</code>'), '<code><span class="token color-value" style="--color-value: hsla(255,50%,100%,0.9)" aria-hidden="true"></span>hsla(255,50%,100%,0.9)</code>');
	t.is(addColourHooks('<code>hsla(255,50%,100%,0.9%)</code>'), '<code><span class="token color-value" style="--color-value: hsla(255,50%,100%,0.9%)" aria-hidden="true"></span>hsla(255,50%,100%,0.9%)</code>');
	t.is(addColourHooks('<code>hsla(255,50%,100%, 0.45)</code>'), '<code><span class="token color-value" style="--color-value: hsla(255,50%,100%, 0.45)" aria-hidden="true"></span>hsla(255,50%,100%, 0.45)</code>');
	t.is(addColourHooks('<code>hsla(255,50%,100%, 0.45%)</code>'), '<code><span class="token color-value" style="--color-value: hsla(255,50%,100%, 0.45%)" aria-hidden="true"></span>hsla(255,50%,100%, 0.45%)</code>');
	t.is(addColourHooks('<code>hsla(255,50%,100%/100)</code>'), '<code><span class="token color-value" style="--color-value: hsla(255,50%,100%/100)" aria-hidden="true"></span>hsla(255,50%,100%/100)</code>');
	t.is(addColourHooks('<code>hsla(255,50%,100%/100%)</code>'), '<code><span class="token color-value" style="--color-value: hsla(255,50%,100%/100%)" aria-hidden="true"></span>hsla(255,50%,100%/100%)</code>');
	t.is(addColourHooks('<code>hsla(255,50%,100% / 1)</code>'), '<code><span class="token color-value" style="--color-value: hsla(255,50%,100% / 1)" aria-hidden="true"></span>hsla(255,50%,100% / 1)</code>');
	t.is(addColourHooks('<code>hsla(255,50%,100% / 1%)</code>'), '<code><span class="token color-value" style="--color-value: hsla(255,50%,100% / 1%)" aria-hidden="true"></span>hsla(255,50%,100% / 1%)</code>');


	t.is(addColourHooks('<code>hsl(400deg,50%,100%)</code>'), '<code><span class="token color-value" style="--color-value: hsl(400deg,50%,100%)" aria-hidden="true"></span>hsl(400deg,50%,100%)</code>');
	t.is(addColourHooks('<code>hsl(50grad,50%,100%)</code>'), '<code><span class="token color-value" style="--color-value: hsl(50grad,50%,100%)" aria-hidden="true"></span>hsl(50grad,50%,100%)</code>');
	t.is(addColourHooks('<code>hsl(3.1416rad,50%,100%)</code>'), '<code><span class="token color-value" style="--color-value: hsl(3.1416rad,50%,100%)" aria-hidden="true"></span>hsl(3.1416rad,50%,100%)</code>');
	t.is(addColourHooks('<code>hsl(0.75turn,50%,100%)</code>'), '<code><span class="token color-value" style="--color-value: hsl(0.75turn,50%,100%)" aria-hidden="true"></span>hsl(0.75turn,50%,100%)</code>');
	t.is(addColourHooks('<code>hsl(.75turn,50%,100%)</code>'), '<code><span class="token color-value" style="--color-value: hsl(.75turn,50%,100%)" aria-hidden="true"></span>hsl(.75turn,50%,100%)</code>');

	t.is(addColourHooks('<code>color:hsl(255,50%,100%);</code>'), '<code>color:<span class="token color-value" style="--color-value: hsl(255,50%,100%)" aria-hidden="true"></span>hsl(255,50%,100%);</code>');
	t.is(addColourHooks('<code>color: hsl(255,50%,100%)</code>'), '<code>color: <span class="token color-value" style="--color-value: hsl(255,50%,100%)" aria-hidden="true"></span>hsl(255,50%,100%)</code>');
	t.is(addColourHooks('<code><span>hsl(255,50%,100%)</span></code>'), '<code><span><span class="token color-value" style="--color-value: hsl(255,50%,100%)" aria-hidden="true"></span>hsl(255,50%,100%)</span></code>');
});


test('Ignores invalid HSL colours', t => {
	t.is(addColourHooks('<code>ahsl(255,50%,100%)</code>'), '<code>ahsl(255,50%,100%)</code>');
	t.is(addColourHooks('<code>hslb(255,50%,100%)</code>'), '<code>hslb(255,50%,100%)</code>');
	t.is(addColourHooks('<code>hsl(255,50%,100%)a</code>'), '<code>hsl(255,50%,100%)a</code>');

	t.is(addColourHooks('<code>hsl(a,50%,100%)</code>'), '<code>hsl(a,50%,100%)</code>');
	t.is(addColourHooks('<code>hsl(100turns,50%,100%)</code>'), '<code>hsl(100turns,50%,100%)</code>');
	t.is(addColourHooks('<code>hsl(100turns,50,100%)</code>'), '<code>hsl(100turns,50,100%)</code>');
});


test('Adds HWB colour hooks', t => {
	t.is(addColourHooks('<code>hwb(180 50% 100%)</code>'), '<code><span class="token color-value" style="--color-value: hwb(180 50% 100%)" aria-hidden="true"></span>hwb(180 50% 100%)</code>');
	t.is(addColourHooks('<code>HWB(180 50% 100%)</code>'), '<code><span class="token color-value" style="--color-value: HWB(180 50% 100%)" aria-hidden="true"></span>HWB(180 50% 100%)</code>');
	t.is(addColourHooks('<code>hwb(180 -50% 100%)</code>'), '<code><span class="token color-value" style="--color-value: hwb(180 -50% 100%)" aria-hidden="true"></span>hwb(180 -50% 100%)</code>');

	t.is(addColourHooks('<code>hwb(45deg 20% 86%)</code>'), '<code><span class="token color-value" style="--color-value: hwb(45deg 20% 86%)" aria-hidden="true"></span>hwb(45deg 20% 86%)</code>');
	t.is(addColourHooks('<code>hwb(40grad 56% 12%)</code>'), '<code><span class="token color-value" style="--color-value: hwb(40grad 56% 12%)" aria-hidden="true"></span>hwb(40grad 56% 12%)</code>');
	t.is(addColourHooks('<code>hwb(3.1416rad 87% 3%)</code>'), '<code><span class="token color-value" style="--color-value: hwb(3.1416rad 87% 3%)" aria-hidden="true"></span>hwb(3.1416rad 87% 3%)</code>');
	t.is(addColourHooks('<code>hwb(0.8turn 99% 13%)</code>'), '<code><span class="token color-value" style="--color-value: hwb(0.8turn 99% 13%)" aria-hidden="true"></span>hwb(0.8turn 99% 13%)</code>');
	t.is(addColourHooks('<code>hwb(.8turn 4% 87%)</code>'), '<code><span class="token color-value" style="--color-value: hwb(.8turn 4% 87%)" aria-hidden="true"></span>hwb(.8turn 4% 87%)</code>');

	t.is(addColourHooks('<code>hwb(180 50% 100%/0.9)</code>'), '<code><span class="token color-value" style="--color-value: hwb(180 50% 100%/0.9)" aria-hidden="true"></span>hwb(180 50% 100%/0.9)</code>');
	t.is(addColourHooks('<code>hwb(180 50% 100%/37%)</code>'), '<code><span class="token color-value" style="--color-value: hwb(180 50% 100%/37%)" aria-hidden="true"></span>hwb(180 50% 100%/37%)</code>');
	t.is(addColourHooks('<code>hwb(180 50% 100% / 0.9)</code>'), '<code><span class="token color-value" style="--color-value: hwb(180 50% 100% / 0.9)" aria-hidden="true"></span>hwb(180 50% 100% / 0.9)</code>');
	t.is(addColourHooks('<code>hwb(180 50% 100% / 37%)</code>'), '<code><span class="token color-value" style="--color-value: hwb(180 50% 100% / 37%)" aria-hidden="true"></span>hwb(180 50% 100% / 37%)</code>');

	t.is(addColourHooks('<code>color:hwb(180 50% 100%);</code>'), '<code>color:<span class="token color-value" style="--color-value: hwb(180 50% 100%)" aria-hidden="true"></span>hwb(180 50% 100%);</code>');
	t.is(addColourHooks('<code>color: hwb(180 50% 100%)</code>'), '<code>color: <span class="token color-value" style="--color-value: hwb(180 50% 100%)" aria-hidden="true"></span>hwb(180 50% 100%)</code>');
	t.is(addColourHooks('<code><span>hwb(180 50% 100%)</span></code>'), '<code><span><span class="token color-value" style="--color-value: hwb(180 50% 100%)" aria-hidden="true"></span>hwb(180 50% 100%)</span></code>');
});


test('Ignores invalid HWB colours', t => {
	t.is(addColourHooks('<code>ahwb(180 50% 100%)</code>'), '<code>ahwb(180 50% 100%)</code>');
	t.is(addColourHooks('<code>hwba(180 50% 100%)</code>'), '<code>hwba(180 50% 100%)</code>');
	t.is(addColourHooks('<code>hwb(180 50% 100%)a</code>'), '<code>hwb(180 50% 100%)a</code>');

	t.is(addColourHooks('<code>hwb(180% 50% 100%)</code>'), '<code>hwb(180% 50% 100%)</code>');
	t.is(addColourHooks('<code>hwb(180 50 100)</code>'), '<code>hwb(180 50 100)</code>');
	t.is(addColourHooks('<code>hwb(0.5turns 50% 100%)</code>'), '<code>hwb(0.5turns 50% 100%)</code>');
	t.is(addColourHooks('<code>hwb(180 50% 100% 0.9)</code>'), '<code>hwb(180 50% 100% 0.9)</code>');
	t.is(addColourHooks('<code>hwb(180 50% 100% / a)</code>'), '<code>hwb(180 50% 100% / a)</code>');
});


test('Adds Lab colour hooks', t => {
	t.is(addColourHooks('<code>lab(50% 10 90)</code>'), '<code><span class="token color-value" style="--color-value: lab(50% 10 90)" aria-hidden="true"></span>lab(50% 10 90)</code>');
	t.is(addColourHooks('<code>LAB(50% 10 90)</code>'), '<code><span class="token color-value" style="--color-value: LAB(50% 10 90)" aria-hidden="true"></span>LAB(50% 10 90)</code>');
	t.is(addColourHooks('<code>lab(50% -10 90)</code>'), '<code><span class="token color-value" style="--color-value: lab(50% -10 90)" aria-hidden="true"></span>lab(50% -10 90)</code>');

	t.is(addColourHooks('<code>lab(50% -10 90/0.9)</code>'), '<code><span class="token color-value" style="--color-value: lab(50% -10 90/0.9)" aria-hidden="true"></span>lab(50% -10 90/0.9)</code>');
	t.is(addColourHooks('<code>lab(50% -10 90/37%)</code>'), '<code><span class="token color-value" style="--color-value: lab(50% -10 90/37%)" aria-hidden="true"></span>lab(50% -10 90/37%)</code>');
	t.is(addColourHooks('<code>lab(50% -10 90 / 0.9)</code>'), '<code><span class="token color-value" style="--color-value: lab(50% -10 90 / 0.9)" aria-hidden="true"></span>lab(50% -10 90 / 0.9)</code>');
	t.is(addColourHooks('<code>lab(50% -10 90 / 37%)</code>'), '<code><span class="token color-value" style="--color-value: lab(50% -10 90 / 37%)" aria-hidden="true"></span>lab(50% -10 90 / 37%)</code>');

	t.is(addColourHooks('<code>color:lab(50% 10 90);</code>'), '<code>color:<span class="token color-value" style="--color-value: lab(50% 10 90)" aria-hidden="true"></span>lab(50% 10 90);</code>');
	t.is(addColourHooks('<code>color: lab(50% 10 90)</code>'), '<code>color: <span class="token color-value" style="--color-value: lab(50% 10 90)" aria-hidden="true"></span>lab(50% 10 90)</code>');
	t.is(addColourHooks('<code><span>lab(50% 10 90)</span></code>'), '<code><span><span class="token color-value" style="--color-value: lab(50% 10 90)" aria-hidden="true"></span>lab(50% 10 90)</span></code>');
});


test('Ignores invalid Lab colours', t => {
	t.is(addColourHooks('<code>alab(50% 10 90)</code>'), '<code>alab(50% 10 90)</code>');
	t.is(addColourHooks('<code>laba(50% 10 90)</code>'), '<code>laba(50% 10 90)</code>');
	t.is(addColourHooks('<code>lab(50% 10 90)a</code>'), '<code>lab(50% 10 90)a</code>');

	t.is(addColourHooks('<code>lab(50 10 90)</code>'), '<code>lab(50 10 90)</code>');
	t.is(addColourHooks('<code>lab(50 10% 90)</code>'), '<code>lab(50 10% 90)</code>');
	t.is(addColourHooks('<code>lab(50 10% 90 0.9)</code>'), '<code>lab(50 10% 90 0.9)</code>');
	t.is(addColourHooks('<code>lab(50 10% 90 / a)</code>'), '<code>lab(50 10% 90 / a)</code>');
});


test('Adds LCH colour hooks', t => {
	t.is(addColourHooks('<code>lch(50% 10 90)</code>'), '<code><span class="token color-value" style="--color-value: lch(50% 10 90)" aria-hidden="true"></span>lch(50% 10 90)</code>');
	t.is(addColourHooks('<code>LCH(50% 10 90)</code>'), '<code><span class="token color-value" style="--color-value: LCH(50% 10 90)" aria-hidden="true"></span>LCH(50% 10 90)</code>');
	t.is(addColourHooks('<code>lch(50% -10 90)</code>'), '<code><span class="token color-value" style="--color-value: lch(50% -10 90)" aria-hidden="true"></span>lch(50% -10 90)</code>');

	t.is(addColourHooks('<code>lch(50% 10 45deg)</code>'), '<code><span class="token color-value" style="--color-value: lch(50% 10 45deg)" aria-hidden="true"></span>lch(50% 10 45deg)</code>');
	t.is(addColourHooks('<code>lch(50% 10 40grad)</code>'), '<code><span class="token color-value" style="--color-value: lch(50% 10 40grad)" aria-hidden="true"></span>lch(50% 10 40grad)</code>');
	t.is(addColourHooks('<code>lch(50% 10 3.1416rad)</code>'), '<code><span class="token color-value" style="--color-value: lch(50% 10 3.1416rad)" aria-hidden="true"></span>lch(50% 10 3.1416rad)</code>');
	t.is(addColourHooks('<code>lch(50% 10 0.8turn)</code>'), '<code><span class="token color-value" style="--color-value: lch(50% 10 0.8turn)" aria-hidden="true"></span>lch(50% 10 0.8turn)</code>');
	t.is(addColourHooks('<code>lch(50% 10 .8turn)</code>'), '<code><span class="token color-value" style="--color-value: lch(50% 10 .8turn)" aria-hidden="true"></span>lch(50% 10 .8turn)</code>');

	t.is(addColourHooks('<code>lch(50% -10 90/0.9)</code>'), '<code><span class="token color-value" style="--color-value: lch(50% -10 90/0.9)" aria-hidden="true"></span>lch(50% -10 90/0.9)</code>');
	t.is(addColourHooks('<code>lch(50% -10 90/37%)</code>'), '<code><span class="token color-value" style="--color-value: lch(50% -10 90/37%)" aria-hidden="true"></span>lch(50% -10 90/37%)</code>');
	t.is(addColourHooks('<code>lch(50% -10 90 / 0.9)</code>'), '<code><span class="token color-value" style="--color-value: lch(50% -10 90 / 0.9)" aria-hidden="true"></span>lch(50% -10 90 / 0.9)</code>');
	t.is(addColourHooks('<code>lch(50% -10 90 / 37%)</code>'), '<code><span class="token color-value" style="--color-value: lch(50% -10 90 / 37%)" aria-hidden="true"></span>lch(50% -10 90 / 37%)</code>');

	t.is(addColourHooks('<code>color:lch(50% 10 90);</code>'), '<code>color:<span class="token color-value" style="--color-value: lch(50% 10 90)" aria-hidden="true"></span>lch(50% 10 90);</code>');
	t.is(addColourHooks('<code>color: lch(50% 10 90)</code>'), '<code>color: <span class="token color-value" style="--color-value: lch(50% 10 90)" aria-hidden="true"></span>lch(50% 10 90)</code>');
	t.is(addColourHooks('<code><span>lch(50% 10 90)</span></code>'), '<code><span><span class="token color-value" style="--color-value: lch(50% 10 90)" aria-hidden="true"></span>lch(50% 10 90)</span></code>');
});


test('Ignores invalid LCH colours', t => {
	t.is(addColourHooks('<code>alch(50% 10 90)</code>'), '<code>alch(50% 10 90)</code>');
	t.is(addColourHooks('<code>lcha(50% 10 90)</code>'), '<code>lcha(50% 10 90)</code>');
	t.is(addColourHooks('<code>lch(50% 10 90)a</code>'), '<code>lch(50% 10 90)a</code>');

	t.is(addColourHooks('<code>lch(50 10 90)</code>'), '<code>lch(50 10 90)</code>');
	t.is(addColourHooks('<code>lch(50 10% 90)</code>'), '<code>lch(50 10% 90)</code>');
	t.is(addColourHooks('<code>lch(50 10 0.5turns)</code>'), '<code>lch(50 10 0.5turns)</code>');
	t.is(addColourHooks('<code>lch(50 10% 90 0.9)</code>'), '<code>lch(50 10% 90 0.9)</code>');
	t.is(addColourHooks('<code>lch(50 10% 90 / a)</code>'), '<code>lch(50 10% 90 / a)</code>');
});


test('Colours are ignored outside of code', t => {
	t.is(addColourHooks('<div>#fff</div>'), '<div>#fff</div>');
	t.is(addColourHooks('<pre>#fff</pre>'), '<pre>#fff</pre>');

	t.is(addColourHooks('<div>rgb(255, 255 ,255)</div>'), '<div>rgb(255, 255 ,255)</div>');
	t.is(addColourHooks('<pre>rgb(255, 255 ,255)</pre>'), '<pre>rgb(255, 255 ,255)</pre>');

	t.is(addColourHooks('<div>hsl(240, 100%, 50%)</div>'), '<div>hsl(240, 100%, 50%)</div>');
	t.is(addColourHooks('<pre>hsl(240, 100%, 50%)</pre>'), '<pre>hsl(240, 100%, 50%)</pre>');

	t.is(addColourHooks('<div>lab(52.2345% 72.2 56.2)</div>'), '<div>lab(52.2345% 72.2 56.2)</div>');
	t.is(addColourHooks('<pre>lab(52.2345% 72.2 56.2)</pre>'), '<pre>lab(52.2345% 72.2 56.2)</pre>');

	t.is(addColourHooks('<div>lch(54.29% 106.839 0.5turn)</div>'), '<div>lch(54.29% 106.839 0.5turn)</div>');
	t.is(addColourHooks('<pre>lch(54.29% 106.839 0.5turn)</pre>'), '<pre>lch(54.29% 106.839 0.5turn)</pre>');
});