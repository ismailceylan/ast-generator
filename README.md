# Abstract Syntax Tree Generator

This javascript library creates meaningful nodes by performing logical and sequential reading operations on string arrays. For example, html, markdown and any other language can be parsed into AST by this library.

It provides a set of classes to remodel the structure of the language step by step. It kind of a core of the regular expression mechanism but with this library, plenty of possibilities unlocked.

## Installation

```bash
npm install @iceylan/ast-generator
```

## Usage

```javascript
import { Parser, component, exact, skip, multi, until, optional, not, space }
	from "@iceylan/ast-generator";

const parser = new Parser(
{
	components:
	{
		bold: component(
		{
			structure:
			[
				exact( "<" ),
				skip( space ),
				exact( "b" ),
				skip( space ),
				optional( ">" ).name( "afterTag" ),
				if(({ afterTag }) => afterTag !== ">" ).structure(
				[
					multi( "attrs" ).structure(
					[
						skip( space ),
						until([ " ", "=" ], "name" ),
						skip( space ),
						exact( "=" ),
						skip( space ),
						exact( "\"" ),
						until([ "\"" ], "value" ),
						exact( "\"" )
					]),
				]),
				skip( space ),
				exact( ">" ),
			]
		})
		
	}
});

```
