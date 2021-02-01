## Features
- Syntax highlighting
- Line numbers
- Trim trailing new line in Markdown
- Language Labels
- Colour previews
- Auto add CSS
- Auto add JS


## Syntax highlighting

### Hooks
- syntax wrapped in spans with token classes
- language class on code
- language class on pre

### Features
- changes lang-xxx class to language-xxx
- add code elements' language class to ancestor pre elements
- global language default
- inherit language class from ancestors for defacto defaults
- toggle highlighting with data-highlight-syntax="true/false"
- remove data-highlight-syntax attributes
- remove language classes from non-pre and non-code elements
- remove language classes from pre elements if no code children
- remove language classes from pre elements if not used by code children

### Global options
- removeRedundancy: Boolean
- highlightSyntax: Boolean


## Line numbers

### Hooks
- new lines have span after them with "token line-number" class
- "line-numbers" class on code
- "line-numbers" class on pre

### Features
- add line numbers class to all code elements within pre
- add line numbers class to all pre elements with children code elements
- inherit data-line-numbers="true/false" from ancestors for defacto defaults
- toggle line numbers with data-line-numbers="true/false" attribute on pre or higher
- remove data-line-numbers attributes

### Global options
- removeRedundancy: Boolean
- lineNumbers: Boolean


## Trim trailing new line in Markdown

### Features
- Removes the automatic new line added to the end of all Markdown code blocks

### Global options
- markdownTrimTrailingNewline: Boolean


## Language Labels

### Hooks
- data-language="xxx" attribute on code
- data-language="xxx" attribute on pre

### Features
- add existing language classes as attributes
- inherit data-language-labels="true/false" from ancestors for defacto defaults
- toggle on/off with data-language-labels="true/false" attribute
- remove data-language-labels attributes

### Global options
- removeRedundancy: Boolean
- languageLabels: Boolean


## Inline colour preview

### Hooks
- colours have span before them with "color-preview" class and style="--color-value: 'value'" property

### Features
- CSS code with RGB, HSL and Hex colour values are automatically selected
- inherit data-color-previews="true/false" from ancestors for defacto defaults
- toggle on/off with data-color-previews="true/false" attribute
- remove data-color-previews attributes

### Global options
- removeRedundancy: Boolean
- colorPreviews: Boolean


## Auto add CSS

### Features
- auto add external CSS files to head if any code block present
- add optional attributes
- adds head if head missing

### Global options
- styles: String or Object or Array[String or Object]


## Auto add JS

### Features
- auto add external JS files to head if any code block present
- add optional attributes
- adds head if head missing

### Global options
- scripts: String or Object or Array[String or Object]