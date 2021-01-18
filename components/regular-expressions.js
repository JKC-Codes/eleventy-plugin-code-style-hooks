// Regex = look behind to check for start of line or whitespace in a non-capture group
const wordStart = String.raw`(?<=^|\s)`;

// Regex = look ahead to check for end of line or whitespace in a non-capture group
const wordEnd = String.raw`(?=$|\s)`;

// Regex = 'lang' + optional 'uage' in a non-capture group
const languageStart = String.raw`lang(?:uage)?`;

// Regex = 1 or more letters, numbers, underscores or dashes in a capture group
const languageName = String.raw`([\w-]+)`;

// Regex = look behind to check for whitespace or ',' or start of line or '(' or ':' in a non-capture group
const colorStart = String.raw`(?<=\s|,|^|\(|:)`;

// Regex = look ahead to check for whitespace or ',' or end of line or ')' or ';' in a non-capture group
const colorEnd = String.raw`(?=\s|,|$|\)|;)`;

// Regex = 1 or more whitespace characters or a comma surrounded by optional whitespace in a non-capture group
const colorSeparator = String.raw`(?:\s+|(?:\s*,\s*))`;

// Regex = optional '+' or '-' in a non-capture group + any amount of numbers + optional '.' followed by any amount of numbers in a non-capture group. Or optional '+' or '-' + '.' followed by any amount of numbers
const colorNumber = String.raw`(?:(?:\+|-)?\d+(?:\.\d+)?|\.\d+)`;

// Regex = number regex + '%'
const colorPercentage = String.raw`(?:${colorNumber}%)`;

// Regex = number regex + 'deg' 'grad' 'rad' or 'turn' in a non-capture group
const colorAngle = String.raw`(?:${colorNumber}(?:deg|grad|rad|turn))`;

// Regex = number regex or angle regex
const colorHue = String.raw`(?:${colorNumber}|${colorAngle})`;

// Regex = number regex or precentage regex
const colorAlpha = String.raw`(?:${colorNumber}|${colorPercentage})`;

// Regex = # + non-capturing group of 0-9 or a-f in sets of 8, 6, 4 or 3
const colorHex = String.raw`#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})`;

// Regex = 'rgb' with optional 'a' + '(' + optional whitespace + 3 numbers or 3 percentages separated by a comma or whitespace + optional comma or '/' followed by a number or percentage + whitespace + ')'
const colorRGB = String.raw`rgba?\(\s*(?:(?:${colorNumber}${colorSeparator}${colorNumber}${colorSeparator}${colorNumber})|(?:${colorPercentage}${colorSeparator}${colorPercentage}${colorSeparator}${colorPercentage}))(?:\s*(?:,|\/)\s*${colorAlpha})?\s*\)`;

// Regex = 'hsl' with optional 'a' + '(' + optional whitespace + hue regex + whitespace with optional comma + percentage regex + whitespace with optional comma + percentage regex + optional whitespace followed by ',' or '/' and alpha regex + optional whitespace + ')'
const colorHSL = String.raw`hsla?\(\s*${colorHue}${colorSeparator}${colorPercentage}${colorSeparator}${colorPercentage}(?:\s*(?:,|\/)\s*${colorAlpha})?\s*\)`;

// Regex = 'hwb(' + optional whitespace + hue regex + one or more whitespace + percentage regex + one or more whitespace + percentage regex + optional whitespace followed by '/' + optional whitespace + alpha regex + optional whitespace + ')'
const colorHWB = String.raw`hwb\(\s*${colorHue}\s+${colorPercentage}\s+${colorPercentage}(?:\s*\/\s*${colorAlpha})?\s*\)`;

// Regex = 'lab(' + optional whitespace + precentage regex + one or more whitespace + number regex + one or more whitespace + number regex + optional whitespace followed by '/' + optional whitespace + alpha regex + optional whitespace + ')'
const colorLab = String.raw`lab\(\s*${colorPercentage}\s+${colorNumber}\s+${colorNumber}(?:\s*\/\s*${colorAlpha})?\s*\)`;

// Regex = 'lch(' + optional whitespace + precentage regex + one or more whitespace + number regex + one or more whitespace + hue regex + optional whitespace followed by '/' + optional whitespace + alpha regex + optional whitespace + ')'
const colorLCH = String.raw`lch\(\s*${colorPercentage}\s+${colorNumber}\s+${colorHue}(?:\s*\/\s*${colorAlpha})?\s*\)`;

// Regex = All CSS named colours in a non-capture group
const colorNamed = String.raw`(?:aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)`;

// Regex = '<' + optional '/' + 1 or more characters that aren't '>' or whitespace + optional any number of space followed by 0 or more characters that are not '>' + '>'
const HTMLTag = String.raw`<\/?(?:[^>\s]+)(?:\s[^>]*)?>`;


module.exports = {
	wordStart,
	wordEnd,
	// 'lang-xxxx' or 'language-xxxx'
	classLanguage: String.raw`${wordStart}${languageStart}-${languageName}${wordEnd}`,
	// 'line-numbers'
	classLineNumbers: String.raw`${wordStart}line-numbers${wordEnd}`,
	// 'data-line-numbers' or 'data-show-language' or 'data-highlight-syntax' or 'data-show-color'
	attributeData: String.raw`^data-(line-numbers|show-language|highlight-syntax|show-color)$`,
	// new line
	lineNew: String.raw`\n`,
	// hex, RGB, HSL, Lab or LCH colour in a capture group
	color: String.raw`${colorStart}((?:${colorHex})|(?:${colorRGB})|(?:${colorHSL})|(?:${colorHWB})|(?:${colorLab})|(?:${colorLCH}))${colorEnd}`,
	colorNamed,
	number: colorNumber,
	HTMLTag
}