const Prism = require('prismjs');
const loadLanguage = require('prismjs/components/');
const parseHTML = require('posthtml-parser');
const renderHTML = require('posthtml-render');
const regEx = require('./regular-expressions.js');


module.exports = function(string, state, prismAPI) {
	const language = state.language.toLowerCase();
	let highlightSyntax = state.highlightSyntax && state.language;
	let newString = string;

	// Expose Prism to user so they can add new languages
	if(prismAPI) {
		prismAPI(Prism);
	}

	// Prism only loads markup, css, clike and javascript by default
	if(highlightSyntax && !Prism.languages[language]) {
		loadLanguage.silent = true;
		loadLanguage([language]);

		if(!Prism.languages[language]) {
			highlightSyntax = false;
		}
	}

	if(highlightSyntax) {
		// Make Prism recognise colours or not, depending on user options
		if(state.colorPreviews) {
			addColorToken(Prism);
		}
		else {
			delete Prism.languages.css.color;
		}

		// Make sure Prism doesn't highlight escape characters
		const unescapedString = renderHTML(parseHTML(newString, {decodeEntities: true}));

		newString = Prism.highlight(unescapedString, Prism.languages[language], language);
	}

	if(state.lineNumbers && state.isChildOfPre) {
		// $& = the matched string
		const lineNumber = '$&<span class="token line-number" aria-hidden="true"></span>';

		newString = newString.replace(new RegExp(regEx.lineNew, 'g'), lineNumber);
	}

	return newString;
}


function addColorToken(Prism) {
	if(!Prism.languages.css.color) {
		Prism.languages.insertBefore('css', 'property', {
			'color': [
				new RegExp(regEx.colorNamed, 'i'),
				{
					pattern: new RegExp(regEx.color, 'i'),
					inside: {
						// Regex = Negative look behind for '#' followed by any number of hex characters + look behind for a number + '%' or one or more letters
						'unit': new RegExp(`(?<!#[a-fA-F0-9]*)(?<=${regEx.number})(?:%|[a-zA-Z]+)`),
						// Regex = Negative look behind for '#' followed by any number of hex characters + a number
						'number': new RegExp(`(?<!#[a-fA-F0-9]*)${regEx.number}`),
						// Regex = 1 or more alphanumeric characters or '-' followed by a '('
						'function': /[\w-]+(?=\()/,
						// Regex = '(' or ')' or ',' or '/'
						'punctuation': /[(),/]/
					}
				}
			],
		});
	}
}


if(!Prism.codeStyleHooksColorHookAdded) {
	// Stop Prism from loading the same hook more than once
	Prism.codeStyleHooksColorHookAdded = true;
	// If Prism has a color token added, insert span with "token color-preview" class and style="--color-value: 'value'" property before all colours
	Prism.hooks.add('wrap', function(env) {
		if(env.type === 'color' || env.type === 'hexcode') {
			// Prism only provides a string with tokens already added so they need to be removed before getting the colour
			const plainText = env.content.replace(new RegExp(regEx.HTMLTag, 'g'), '');
			const color = new RegExp(`${regEx.color}|${regEx.colorNamed}`, 'i').exec(plainText)[0];

			env.content = `<span class="color-preview" style="--color-value:${color}" aria-hidden="true"></span>${env.content}`;
		}
	});
}