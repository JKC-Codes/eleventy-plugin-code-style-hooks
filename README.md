# Code Style Hooks
An [11ty](https://www.11ty.dev/) plugin that adds style hooks to `code` elements at build time using [Prism](https://prismjs.com/) so you can highlight syntax using CSS.


- [Installation](#installation)
- [Usage](#usage)
	- [PostHTML](#posthtml)
- [Configuration](#configuration)
	- [colorPreviews](#colorpreviews)
	- [defaultLanguage](#defaultlanguage)
	- [highlightSyntax](#highlightsyntax)
	- [languageLabels](#languagelabels)
	- [lineNumbers](#linenumbers)
	- [markdownTrimTrailingNewline](#markdowntrimtrailingnewline)
	- [removeRedundancy](#removeredundancy)
	- [scripts](#scripts)
	- [styles](#styles)
- [Inline Options](#inline-options)
- [Differences](#differences)
	- [Official Plugin](#official-plugin)
	- [Prism JS](#prism-js)
- [Licence](#licence)


## Installation

```shell
npm install eleventy-plugin-code-style-hooks
```


## Usage

In your [Eleventy config file](https://www.11ty.dev/docs/config/) (`.eleventy.js` by default):
```js
const codeStyleHooks = require('eleventy-plugin-code-style-hooks');

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(codeStyleHooks);
}
```

Then add your CSS file to the page (or [configure Code Style Hooks to do this automatically](#styles)).
```html
<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="/static/styles/prism.min.css">
</head>
…
</html>
```


### PostHTML
Code Style Hooks provides a [PostHTML](https://posthtml.org/) compatible version so you can reduce build times by reusing an existing PostHTML syntax tree.

The `posthtml` export provides a standalone version of Code Style Hooks. This could even be used outside of Eleventy.

The optional `parser` export provides an options parser to further reduce build times when using Eleventy's `--watch` or `--serve` options. Parsing your options outside of the transform will mean this is only done once at the start of watching or serving rather than every time Eleventy builds.

```js
const posthtml = require('posthtml');
const anotherPostHTMLPlugin = require('another-posthtml-plugin');
const { posthtml: codeStyleHooks, parser } = require('eleventy-plugin-code-style-hooks');
const options = parser({defaultLanguage: 'js'});

module.exports = function(eleventyConfig) {
	eleventyConfig.addTransform('posthtml', function(HTMLString, outputPath) {
		if(outputPath && outputPath.endsWith('.html')) {
			return posthtml([codeStyleHooks(options), anotherPostHTMLPlugin()])
				.process(HTMLString)
				.then(result => result.html);
		}
		else {
			return HTMLString;
		}
	});
}
```


## Configuration
```js
const codeStyleHooks = require('eleventy-plugin-code-style-hooks');

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(codeStyleHooks, {
		colorPreviews: true,
		defaultLanguage: 'js',
		highlightSyntax: true,
		languageLabels: true,
		lineNumbers: true,
		markdownTrimTrailingNewline: true,
		prism: function(prism) {
			prism.languages.example = {
				tokenname: /\w+/i
			}
		}
		removeRedundancy: true,
		scripts: '/static/scripts/code-blocks.js',
		styles: '/static/styles/prism.js'
	});
}
```


### colorPreviews
- Default: True
- Accepts: Boolean
- Hooks: Colours have a span around them with `class="token color"` and an empty span before them with `class="color-preview"` and `style="--color-value:colourvalue"` property

```html
<!-- #fff -->
<span class="token color"><span class="color-preview" style="--color-value:#fff" aria-hidden="true"></span>#fff</span>
```

Insert spans in and around CSS colours. Applies to Hex, RGB, HSL, HWB, Lab, LCH and named colours (excluding system colours).

Works with CSS and other languages that extend the CSS language in Prism.

[highlightSyntax](#highlightsyntax) must be `True`.

See the [examples folder](https://github.com/JKC-Codes/eleventy-plugin-code-style-hooks/examples) of the Code Style Hooks repo for example CSS.


### defaultLanguage
- Default: ''
- Accepts: String

Set a global default for `code` elements missing a `class="language=xxx"` attribute. For example, setting this as '*js*' will apply `class="language-js"`.

See [https://prismjs.com/#supported-languages](https://prismjs.com/#supported-languages) for a list of built-in Prism languages.


### highlightSyntax
- Default: True
- Accepts: Boolean
- Hooks: see [Prism FAQs](https://prismjs.com/faq.html#how-do-i-know-which-tokens-i-can-style-for)

Turn syntax highlighting from Prism on or off. See [https://prismjs.com/](https://prismjs.com/) for more information.


### languageLabels
- Default: True
- Accepts: Boolean
- Hooks: `code` and `pre` elements have a `data-language="languagename"` attribute

```html
<!-- <pre><code class="language-CSS"></code></pre> -->
<pre class="language-css" data-language="CSS"><code class="language-css" data-language="CSS"></code></pre>
```

Insert a data attribute on `code` and `pre` elements matching the language from the *language-xxx* class.

Keeps the case from the *language-xxx* class, for example, `class="language-JaVaScRiPt"` will apply a `data-language="JaVaScRiPt"` attribute.

[highlightSyntax](#highlightsyntax) must be `True`.

See the [examples folder](https://github.com/JKC-Codes/eleventy-plugin-code-style-hooks/examples) of the Code Style Hooks repo for example CSS.


### lineNumbers
- Default: True
- Accepts: Boolean
- Hooks: `code` and `pre` elements have `class="line-numbers"` and `code` elements have `<span class="token line-number" aria-hidden="true"></span>` inserted at the start of each new line and the start of the line `code` is on.

```html
<!--
<pre><code>line 1
line 2</code></pre>
-->
<pre class="line-numbers"><span class="token line-number" aria-hidden="true"></span><code class="line-numbers">line 1
<span class="token line-number" aria-hidden="true"></span>line 2</code></pre>
```

Insert spans at the start of each line within a `code` block with a `pre` parent.

If you're getting an empty line at the end of Markdown generated code blocks, you may need to turn on [markdownTrimTrailingNewline](#markdowntrimnrailingnewline).

See the [examples folder](https://github.com/JKC-Codes/eleventy-plugin-code-style-hooks/examples) of the Code Style Hooks repo for example CSS.


### markdownTrimTrailingNewline
- Default: True
- Accepts: Boolean

Remove the unavoidable new line character at the end of Markdown code blocks. Warning: turning this off while line numbers are on will result in an empty numbered line at the end of all Markdown generated code blocks.


### prism
- Accepts: Function

Provides a function that can be called before Prism languages are loaded. Will be passed the Prism module as its only argument. Can be used to add/customise languages.


### removeRedundancy
- Default: True
- Accepts: Boolean

Remove attributes used by Code Style Hooks that aren't needed after builds.

Removes:
- `data-color-previews="true/false"` attributes
- `data-highlight-syntax="true/false"` attributes
- `data-language-labels="true/false"` attributes
- `data-line-numbers="true/false"` attributes
- `language-xxx` classes from non `pre` or `code` elements
- `language-xxx` classes on `code` after the first language class
- `language-xxx` classes from `pre` elements if there are no `code` children or if `code` children don't use that language


### scripts
- Default: []
- Accepts: String, Object or Array of Strings and/or Objects

Append a `script` element to the head of each page with a `code` element on it.

If a URL string is given, a `src="stringValue"` attribute will be automatically added.

If an object is given, each key will be added as an attribute with the key's value as the attribute value.

```html
<!--
{
	src: '/scripts/foo.js',
	defer: ''
}
-->
<script src="/scripts/foo.js" defer=""></script>
```


### styles
- Default: []
- Accepts: String, Object or Array of Strings and/or Objects

Append a `link` element to the head of each page with a `code` element on it.

If a URL string is given, `href="stringValue"` and `rel="stylesheet"` attributes will be automatically added.

If an object is given, each key will be added as an attribute with the key's value as the attribute value.

```html
<!--
{
	href: '/styles/prism-dark.css',
	media: '(prefers-color-scheme: dark)'
}
-->
<link rel="stylesheet" href="/styles/prism-dark.css" media="(prefers-color-scheme: dark)">
```


## Inline Options
The global options defined in your Eleventy config file can be superseded on a page-by-page or element-by-element basis.

The following attributes will supersede the accompanying global option on that element and any children of that element:

- `class="language-xxx"`
- `data-color-previews="true/false"`
- `data-highlight-syntax="true/false"`
- `data-language-labels="true/false"`
- `data-line-numbers="true/false"`


## Differences

### Official Plugin
The [official syntax highlighting plugin](https://www.11ty.dev/docs/plugins/syntaxhighlight/) only applies to Markdown, Nunjucks and Liquid templates, the last two using shortcodes. Code Style Hooks uses a transform to look at all your HTML files and add Prism tags to all `code` elements automatically without shortcodes. This makes the official plugin more efficient but less convenient.

See below for the differences in major options available:
| Option | Official Plugin | Code Style Hooks |
|---:|:---:|:---:|
| Line highlighting | ✓ yes | ✗ no |
| Trim whitespace | ✓ yes | ✗ no |
| Language labels | ✗ no | ✓ yes |
| Colour previews | ✗ no | ✓ yes |
| Auto add CSS/JS | ✗ no | ✓ yes |


### Prism
The main difference between [Prism](https://prismjs.com/) and Code Style Hooks is that Prism runs on the client side whereas Code Style Hooks runs at build time. This means that Prism plugins listed on prismjs.com likely won't work since they expect a DOM.

The only other notable difference is that Code Style Hooks does not remove existing HTML and even allows `code` blocks to be nested.


## Licence
[GNU GPLv3 ](https://choosealicense.com/licenses/gpl-3.0/)