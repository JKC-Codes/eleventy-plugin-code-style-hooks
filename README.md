# Code Style Hooks
An [11ty](https://www.11ty.dev/) plugin that adds code syntax style hooks to your code at build time using [Prism](https://prismjs.com/).


## Differences Compared To The Official Plugin
The [official plugin](https://www.npmjs.com/package/@11ty/eleventy-plugin-code-style-hooks) only applies to Markdown, Nunjucks and Liquid templates, the latter two using shortcodes. This plugin uses a transform to look at all your HTML files and add Prism tags to all code blocks. The official plugin is technically more efficient but this should only matter in huge builds of 1000+ pages.


## Markdown Warning
Don't indent your code

## Licence
[GNU GPLv3 ](https://choosealicense.com/licenses/gpl-3.0/)