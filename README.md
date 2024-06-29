# Abstract Syntax Tree Generator
This javascript library creates tokenized nodes by performing logical and sequential reading operations on string arrays. For example, html, markdown and any other language can be parsed into AST by this library.

It provides a set of methods to remodel the structure of the language step by step. Its pretty similar to the regular expression mechanism but with this library, plenty of possibilities unlocked.

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

## What Is Parser
Parser is like an engine that can take components and run them in order. Under the hood, it is a recursive descent parser. It uses an ascii byte stream to recursively loop the given raw string or document (however you call it). Even if a component matches, it consume bytes as long as it needs and parser will continue to read stream where the component left it and continue to try finding components.

## What Is Component
A component represents any complex structure of the given document. It can be a markdown component, html tag, for loop or a function in javascript or selector and its definition in css. Even further an argument definitons of a function in javascript can be a component.

Every component eventually ends up as an AST node if all of their sequences succeed.

Components have sequences to match and process complex structures as small peaces. That makes components sequence encapsulator.

Under the hood, it creates rollback points, AST node and scope for the component and start to run its sequences step by step to capture desired structures. Some of sequences can consume bytes as long as it needs and some doesn't consume anything, just try to match with current position.

Anyway, if any of the sequences fails, component will rollback to the rollback points at the beginning and stops trying sequences and exits. At this stage, parser will continue from the next component.

On the other hand, if none of the sequences of the component fails then it doesn't rollback and stream cursor stay where it reached (parser will continue from that point) and returns final AST node to parser. Parser will put it into node stack and restart to trying components.

If parser never finds any component then it will put current byte into node stack as a text node and skip next byte and starts all over again.

## What Is Sequence
Sequences are named functions that are creates `Sequence` instances when they're called. They are kind of facades of that class and does operations on stream, scope and AST node of component in which it specialized ways.

For example `match` tries to match with the given target. It doesn't consume bytes, just tries to match. Another one, `consume` will eat bytes as long as it encounters other than the given target etc.

With sequences we can remodel the steps of a structure.

Eaten or not sequences always produce results. Sometimes only a boolean, sometimes a symbol and sometimes strings. If we don't specificaly guide, results will disappear but only the state of the sequence will monitored by its component like failed or passed.

Sequences have modifier methods to give them shape. For example, `as`, `name`, `if`, `is`, `optional` some of them and we will see how to use them and what they do in later.

<!-- For example, `as` method will create a sub-ast node and put captured data by sequence into it and this sub node will be placed into component's ast node.

`name` modifier will put result of the sequence into scope provided by component. Scope is accessible by all the sibling sequences in the component.

`if` or `is` modifiers will keep conditional expressions for the sequence. Before the sequence do its stuff, conditions will be executed and either the sequence will be executed or not. Ofcourse conditions will access the scope provided by component. So that means sequence can access preceded sequence results and make themselves dependant on them.

Sequences can be also optional. If a sequence failed to do what it said it would do, we can ignore it by `optional` method. It works like an alias of `if` or `is` modifier but conditionals works before the sequence and can't know what the state of the sequence is but optional will know the state. -->

