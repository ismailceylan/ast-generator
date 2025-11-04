import localAverage from "@iceylan/local-average/uncompiled";
import { Parser, component, consume, exact, match, text, until, endline, not, newline, beginning, ending, space }
	from "./lib";
import AsciiByteStream from "@iceylan/ascii-byte-stream/uncompiled";

const bkzPart1 = [
	exact( "(" ),
	consume([ " ", "\t" ])
];

const bkzPart2 = [
	exact( ":" ),
	consume([ " ", "\t" ]),
	until([ ")", "/" ]).as( "text" ),
	consume([ " ", "\t" ]).ifCurrent([ " ", "\t" ]),
	exact( "/" ).name( "slash" ).optional(),
	until([ ")" ]).has( "slash" ).as( "target" ),
	consume([ " ", "\t" ]),
	exact( ")" ),
	exact( "<" ).name( "modifier" ).optional(),
		exact([ "@", "$" ]).name( "punc" ).has( "modifier" ),
			until([ ",", ">" ]).as( "author" ).is( "punc", "@" ),
			until([ ",", ">" ]).as( "meaning" ).is( "punc", "$" ),
		exact( "," ).name( "comma" ).optional(),
			exact([ "@", "$" ]).name( "punc" ).has( "comma" ),
			until( ">" ).as( "author" ).is( "punc", "@" ),
			until( ">" ).as( "meaning" ).is( "punc", "$" ),
	exact( ">" ).has( "modifier" )
];

const Markdown =
[
	component( "directbkz", [
		...bkzPart1,
		...bkzPart2
	]),

	component( "bkz", [
		...bkzPart1,
		exact( "bkz" ),
		consume([ " ", "\t" ]),
		...bkzPart2
	]),

	component( "shortbkz", [
		...bkzPart1,
		exact( "*" ),
		consume([ " ", "\t" ]),
		...bkzPart2
	]),

	component( "hr", [
		match([ beginning, newline ]),
		exact( "----" ),
		consume( "-" ),
		match( "\n" )
	]),

	component( "superscript", [
		exact( "^" ),
		not( "^" ),
		until( "^" ).as( "content" ),
		exact( "^" )
	]),

	component( "subscript", [
		exact( "~" ),
		not( "~" ),
		until( "~" ).as( "content" ),
		exact( "~" )
	]),

	component( "highlight", [
		exact( "==" ),
		not( "=" ),
		until( "==" ).as( "content" ),
		exact( "==" )
	]),

	component( "strikethrough", [
		exact( "~~" ),
		not( "~" ),
		until( "~~" ).as( "content" ),
		exact( "~~" )
	]),

	component( "title", [
		match([ beginning, newline ]),
		match( "#" ),
		consume( "#" ).as( "level" ),
		match([ " ", "\t" ]),
		consume([ " ", "\t" ]),
		until( endline ).as( "content" )
	]),

	...emphasis( "italic", 1 ),
	...emphasis( "bold", 2 ),
	...emphasis( "itabold", 3 ),

	component( "hashtag", [
		exact( "#" ),
		until([ space, endline, ending ]).as( "content" )
	]),

	component( "code", [
		match([ beginning, newline ]),
		exact( "```" ),
		until([ ":", endline ]).as( "lang" ).optional(),
		exact( ":" ).name( "colon" ).ifCurrent( ":" ),
		until([ ",", endline ]).as( "line" ).is( "colon", true ),
		exact( "," ).name( "comma" ).ifCurrent( "," ),
		until( endline ).as( "position" ).is( "comma", true ),
		until( "\n```" ).as( "inner" ).optional(),
		exact( "\n```" )
	]),

	component( "inline-code", [
		exact( "`" ),
		not( "`" ),
		until( "`" ).as( "content" ),
		exact( "`" )
	]),

	component( "comment", [
		exact( "<!--" ),
		until( "-->" ).as( "content" ),
		exact( "-->" )
	]),

	component( "link", [
		exact( "[" ),
		until( "]" ).as( "content" ),
		exact( "]" ),
		exact( "(" ),
		until([ " ", "\t", '"', ")" ]).as( "url" ),
		consume([ " ", "\t" ]),
		exact( '"' ).name( "hasQuote" ).optional(),
		until( '"' ).is( "hasQuote", true ).as( "title" ),
		exact( '"' ).is( "hasQuote", true ),
		exact( ")" )
	]),

	component( "image", [
		exact( "![" ),
		until( "]" ).as( "alt" ),
		exact( "]" ),
		exact( "(" ),
		consume([ " ", "\t" ]),
		until([ " ", "\t", '"', ")" ]).as( "url" ),
		consume([ " ", "\t" ]),
		exact( '"' ).name( "hasQuote" ).optional(),
		until( '"' ).is( "hasQuote", true ).as( "title" ),
		exact( '"' ).is( "hasQuote", true ),
		consume([ " ", "\t" ]),
		exact( ")" )
	]),

	component( "blockquote", [
		match([ beginning, newline ]),
		exact( ">" ),
		exact([ " ", "\t" ]),
		consume([ " ", "\t" ]),
		exact( "<" ).name( "cite" ).optional(),
		consume( space ).is( "cite", true ),
		exact( ":" ).is( "cite", true ),
		consume( space ).is( "cite", true ),
		until( ">" ).as( "cite" ).is( "cite", true ),
		exact( ">" ).is( "cite", true ),
		consume( space ).is( "cite", true ),
		until( endline ).as( "content" )
	]),

	component( "list-item", [
		match([ beginning, newline ]),
		consume( " " ).as( "indent" ),
		exact([ "*", "-", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0" ]),
		match([ " ", "\t" ]),
		consume([ " ", "\t" ]),
		until([ endline, ending ]).as( "content" )
	])
];

const PUN = Symbol( "PUN" );
const SPC = Symbol( "SPC" );
const TAB = Symbol( "TAB" );
const NL = Symbol( "NL" );

const js = [
	component( PUN, [
		exact([ "<!--", "-->", "![", "](", ")", "[", "```", "`", "#", ">", ",", ":", "@", "$" ]).xx()
	]),

	component( SPC, [
		exact( " " )
	]),

	component( TAB, [
		exact( "\t" )
	]),

	component( NL, [
		exact( "\n" )
	]),
]

const editor = getById( "editor" );
const markdownParser = new Parser({ components: js });
const [ average, add ] = localAverage( "ast-perf", { sampleSize: 5 });

let latest = 0;
let timer = clearTimeout();

editor.addEventListener( "keyup", () =>
{
	clearTimeout( timer );
	timer = setTimeout( () => update( editor.value ), Math.min( 650, latest * 10 ));
});

update( editor.textContent );

function update( doc )
{
	const start = performance.now();
	let ast = markdownParser.parse( doc );
	const end = performance.now();

	ast = normalizeMarkdownAST( ast );

	add( latest = end - start );

	getById( "top-bar" ).textContent = average( "arithmetic" ) + " ms";
	getById( "ast" ).textContent = JSON.stringify( ast, ( _key, value ) =>
	{
		return typeof value === "symbol"
			? value.toString()
			: value;
	}, 4 );
	getById( "html" ).innerHTML = build( ast );
}

function getById( id )
{
	return window.document.querySelector( "#" + id );
}

function emphasis( name, repeat )
{
	return [
		x( "*" ),
		x( "_" )
	];
	
	function x( chr )
	{
		return component( name, [
			exact( chr.repeat( repeat )),
			not( chr ),
			until([ chr.repeat( repeat ), endline ]).as( "content" ),
			exact( chr.repeat( repeat )),
		])
	}
}

function normalizeMarkdownAST( ast )
{
	return ast;
}

function build( ast )
{
	const stack = [];

	for( const node of ast )
	{
		if( node.skip )
		{
			continue;
		}

		if( node.name == "text" )
		{
			stack.push( node.value );
		}
		else if( node.name == "link" )
		{
			stack.push( `<a target="_blank" href="${ node.url?.value || "" }">${ node.content?.value || "" }</a>` );
		}
		else if( node.name == "code" )
		{
			stack.push(
`<code>${ node.lang? `<lang>${ node.lang?.value.toString() }</lang>` : "" }${( node.inner?.value || "" ).replace( /</g, "&lt;" ).replace( />/g, "&gt;" )}</code>`
			);
		}
		else if( node.name == "inline-code" )
		{
			stack.push( `<code class="inline">${ node.content.value }</code>` );
		}
		else if( node.name == "title" )
		{
			const level = Math.min( node.level.value.length, 6 );

			stack.push( `<h${ level }>${ node.content?.value || " " }</h${ level }>` );
		}
		else if( node.name == "italic" )
		{
			stack.push( `<i>${ node.content.value }</i>` );
		}
		else if( node.name == "bold" )
		{
			stack.push( `<b>${ node.content.value }</b>` );
		}
		else if( node.name == "itabold" )
		{
			stack.push( `<i><b>${ node.content.value }</b></i>` );
		}
		else if( node.name == "comment" )
		{
			stack.push( `<!--${ node.content.value }-->` );
		}
		else if( node.name == "image" )
		{
			stack.push( `<img src="https://biliyon.net/photo/${ node.url?.value }:big" alt="${ node.alt?.value || "" }" title="${ node.title?.value || "" }">` );
		}
		else if( node.name == "hr" )
		{
			stack.push( `<hr>` );
		}
		else if( node.name == "superscript" )
		{
			stack.push( `<sup>${ node.content.value }</sup>` );
		}
		else if( node.name == "subscript" )
		{
			stack.push( `<sub>${ node.content.value }</sub>` );
		}
		else if( node.name == "highlight" )
		{
			stack.push( `<mark>${ node.content.value }</mark>` );
		}
		else if( node.name == "strikethrough" )
		{
			stack.push( `<del>${ node.content.value }</del>` );
		}
		else if( node.name == "directbkz" )
		{
			stack.push( `<a target="_blank" href="https://biliyon.net/search?title=${ node.target?.value || node.text.value }">${ node.text.value }</a>` );
		}
		else if( node.name == "bkz" )
		{
			stack.push( `(bkz: <a target="_blank" href="https://biliyon.net/search?title=${ node.text.value }">${ node.text.value }</a>)` );
		}
		else if( node.name == "shortbkz" )
		{
			stack.push( `<a target="_blank" title="${ node.text.value }" href="https://biliyon.net/search?title=${ node.text.value }">*</a>` );
		}
		else if( node.name == "hashtag" )
		{
			stack.push( `<a target="_blank" href="https://biliyon.net/beta/hashtag/${ node.content.value }">#${ node.content.value }</a>` );
		}
		else if( node.name == "blockquote" )
		{
			const cite = node.cite?.value
				? `<cite>${ node.cite.value }</cite>`
				: "";
			
			stack.push( `<blockquote>${ build( markdownParser.parse( node.content?.value || "" ))}${ cite }</blockquote>` );
		}
	}

	return stack.join( "" );
}
