# Abstract Syntax Tree Generator

This javascript library creates tokenized nodes by performing logical and sequential reading operations on string arrays. For example, html, markdown and any other language can be parsed into AST by this library.

It provides a set of classes to remodel the structure of the language step by step. It kind of a core of the regular expression mechanism but with this library, plenty of possibilities unlocked.

## Installation

```bash
npm install @iceylan/ast-generator
```

## Usage

```javascript
import { Parser, component, exact, not, until, match, text, consume, endline }
	from "@iceylan/ast-generator";

const components = 
[
	component( "italic", [
		exact( "*" ).as( "startDelimiter" ),
		not( "*" ),
		until( "*" ).as( "inner" ),
		exact( "*" ).as( "endDelimiter" ),
	]),

	component( "title", [
		match( "\n#" ),
		text( "\n" ),
		consume( "#" ).as( "level" ),
		exact( " " ).as( "space" ),
		until( endline ).as( "title" ),
	]),
];

const MarkdownParser = new Parser({ components });
const ast = MarkdownParser.parse( "Hello **World**" );
```
