# Abstract Syntax Tree Generator
This JavaScript library creates tokenized nodes by performing logical and sequential reading operations on string arrays. For example, HTML, Markdown, and any other language can be parsed into AST by this library.

It provides a set of methods to remodel the structure of the language step by step. It's pretty similar to the regular expression mechanism, but with this library, plenty of possibilities are unlocked.

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
A parser is like an engine that takes components and runs them in order. Under the hood, it is a recursive descent parser. It uses [AsciiByteStream](https://github.com/ismailceylan/ascii-byte-stream) library to recursively loop through the given raw string or document (however you call it). Even if a component matches, it consumes bytes as long as it needs, and the parser will continue to read the stream from where the component left off and continue trying to find components.

## What Is Component
A component represents any complex structure of the given document. It can be a Markdown component, HTML tag, for loop or a function in JavaScript, or a selector and its definition in CSS. Even further, argument definitions of a function in JavaScript can be a component.

Every component eventually ends up as an AST node if all of its sequences succeed.

Components have sequences to match and process complex structures as small pieces. This makes components sequence encapsulators.

Under the hood, it creates rollback points, AST nodes, and scope for the component and starts to run its sequences step by step to capture desired structures. Some sequences can consume bytes as long as needed, while others don't consume anything, just trying to match the current position.

If any of the sequences fail, the component will roll back to the rollback points at the beginning, stop trying sequences, and exit. At this stage, the parser will continue from the next component.

On the other hand, if none of the sequences of the component fail, it doesn't roll back, and the stream cursor stays where it reached (the parser will continue from that point) and returns the final AST node to the parser. The parser will put it into the node stack and restart trying components.

If the parser never finds any component, it will put the current byte into the node stack as a text node, skip the next byte, and start all over again.

## What Is Sequence
Sequences are named functions that create `Sequence` instances when called. They are facades of that class and perform operations on the stream, scope, and AST node of the component in specialized ways.

For example, `match` tries to match the given target. It doesn't consume bytes; it just tries to match. Another one, `consume`, will eat all the bytes as long as if it doesn't match the given target.

With sequences, we can remodel the steps of a structure.

Whether it consumes bytes or not, sequences always produce results. Sometimes only a boolean, sometimes a symbol, and sometimes strings. If we don't specifically guide, results will disappear, but only the state of the sequence will be monitored by its component, indicating whether it failed or passed.

Sequences have modifier methods to give them shape. For example, `as`, `name`, `if`, `is`, and `optional` are some of them, and we will see how to use them and what they do later.

## What Is AST
AST stands for Abstract Syntax Tree. It will be baked by the parser after parsing process and it is a data structure that tokenizes the structure of the document. By traversing the AST we can access every section of the document, including where they start and end.

## What Is Scope
Scope is a place where sequences can store their results. It is accessible by all the sequences in the component sequentially. That means, the one that comes before cannot access the result of the next one because its not evaluated yet. With modifier methods, we can access the scope and make the sequence dependant some other sequences results. Performing such operations with Regular Expressions can sometimes be difficult.

## What Is Node Stack
Node stack is a class to manage sequentially created nodes. It extends native JavaScript Array constructor and that makes it array-like. It can push, pop, and get nodes from the stack. Additionally it can append any amount of bytes to latest text node with it. If the latest node in the stack is not a text node then a one will be created with the given bytes. It also support rollback for text nodes. That enables to clean up the mess for the failed components. We never see and manupulate this object. Its completely managed by the parser but knowing how it works could make difference.

## What Is Ascii Byte Stream
It is a library that allows us to handle raw string as streams. It supports cursor mechanism and with this we can easily operate on the bytes of the raw strings without losing bytes. Its easily adopt any kind of looping, looking forward, searching targets, consuming conditionally etc. Every sequence will have the common stream object to operate and consume bytes of it. It starts counting from 0 and zero points first byte of the stream. This is the another part of the parser that we won't involve in detail but, again, knowing how it works is important.

## Which Are The Sequence Methods
There are many of them to handle different kinds of scenarios. Let's see them in detail.

### match
Its a sequence that tries to match the given target. It doesn't consume bytes. That means the stream cursor won't move. It just tries to match. Its kind of a `LookAheadPositive` concept in regular expressions. Accepts a one or multibyte string or one of the situation symbols like `newline`, `endline`, `beginning` or `ending`. It also accepts an array of them. With that, it will be like `or` operator in regular expressions, it will successful if it match one of the items in the array.

```js
match( 'ip' ) // true

//     v  <=  cursor was here
`Lorem ipsum dolor.`
//     ^  <=  cursor is still here after executing sequence

match( 'ip' ) // true, cursor doesn't moved, so it will match again
```

We can match `newline` or `endline`, `beginning` or `ending`.

```js
match([ beginning, newline ]) // returns beginning instead of true

// v  <=  cursor was here
  `Lorem ipsum dolor.`
// ^  <=  it's still here
```

`AsciiByteStream` library starts counting from 0 and zero points the first byte's itself, not before it. So, `beginning` constant packages this information and makes it portable by turning it into a symbol.

Another important point is `match` sequence always returns `failed` symbol if it doesn't match. If it matches it always return `true` for primitive `string` and if the target is one of the situation symbols like `newline`, `endline`, `beginning` or `ending` then it returns the matched symbol. Results will be placed on the scope of the component and conditional modifiers like `if` or `as` will consume this results. It is important to know what you will be dealing with in the future.

### exact
This sequence will match exactly the given target and skip them. Its kind of literal character matching known from regex.

```js
exact( "ip" ) // returns true

//     v  <= cursor was here
`Lorem ipsum dolor.`
//       ^  <= cursor moved here

exact( "sum" ) // returns true
```

We can define multiple target to match. In such a situation matching will be successful when any target matches. It's kind of like the "or" statement known from Regex.

```js
exact([ "ip", "su" ]) // returns true

//     v  <= cursor was here
`Lorem ipsum dolor.`
//       ^  <= cursor moved here
```

`exact` sequence works a little bit different than `match` when using situation symbols.

If we want to match the `beginning` of the document it will look if stream cursor is 0. If it is, result will be the beginning symbol but cursor won't be moved because, beginning is not a byte and can't be eaten. As you realized already `match` will work same way. Its up to you to choice which one to use.

```js
exact( beginning ) // returns beginning

// v  <= cursor was here
  `Lorem`
// ^  <= cursor still here

match( beginning ) // returns beginning, cursor still at the same position
```



<!-- For example, `as` method will create a sub-ast node and put captured data by sequence into it and this sub node will be placed into component's ast node.

`name` modifier will put result of the sequence into scope provided by component. Scope is accessible by all the sibling sequences in the component.

`if` or `is` modifiers will keep conditional expressions for the sequence. Before the sequence do its stuff, conditions will be executed and either the sequence will be executed or not. Ofcourse conditions will access the scope provided by component. So that means sequence can access preceded sequence results and make themselves dependant on them.

Sequences can be also optional. If a sequence failed to do what it said it would do, we can ignore it by `optional` method. It works like an alias of `if` or `is` modifier but conditionals works before the sequence and can't know what the state of the sequence is but optional will know the state. -->

