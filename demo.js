import localAverage from "@iceylan/local-average/uncompiled";
import { Parser, component, consume, exact, match, text, until, endline, not, newline, beginning, space, ending }
	from "./lib";

const Markdown =
[
	...italic(), ...bold(), ...itabold(),

	component( "title", [
		match( "\n#" ),
		text( "\n" ),
		consume( "#" ).as( "level" ),
		exact( " " ),
		until( endline ).as( "content" )
	]),

	component( "code", [
		exact( "```" ),
		until( endline ).as( "lang" ),
		exact( newline ),
		until( "\n```" ).as( "inner" ),
		exact( "\n" ),
		exact( "```" )
	]),

	component( "inline-code", [
		exact( "`" ),
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
		until( ")" ).as( "url" ),
		exact( ")" )
	]),

	// component( "xx", [
	// 	match( beginning ),
	// 	until( ["zort",ending] ).as( "rest" ),
	// ])
];

const editor = getById( "editor" );
const markdownParser = new Parser({ components: Markdown });
const [ average, add ] = localAverage( "ast-perf", { sampleSize: 5 });

editor.addEventListener( "input", () => update( editor.value ) );
update( editor.textContent );

function update( doc )
{
	const start = performance.now();
	const ast = markdownParser.parse( doc );
	const end = performance.now();

	add( end - start );

	getById( "top-bar" ).textContent = average( "arithmetic" ) + " ms";
	getById( "ast" ).textContent = JSON.stringify( ast, null, 4 );
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
			until( chr.repeat( repeat )).as( "content" ),
			exact( chr.repeat( repeat )),
		])
	}
}

function italic()
{
	return emphasis( "italic", 1 );
}

function bold()
{
	return emphasis( "bold", 2 );
}

function itabold()
{
	return emphasis( "itabold", 3 );
}

function build( ast )
{
	const stack = [];

	for( const node of ast )
	{
		if( node.name == "text" )
		{
			stack.push( node.value );
		}
		else if( node.name == "link" )
		{
			stack.push( `<a href="${ node.url.value }">${ node.content.value }</a>` );
		}
		else if( node.name == "code" )
		{
			stack.push( `<code>${ node.inner.value }</code>` );
		}
		else if( node.name == "inline-code" )
		{
			stack.push( `<code class="inline">${ node.content.value }</code>` );
		}
		else if( node.name == "title" )
		{
			const level = node.level.value.length;

			stack.push( `<h${ level }>${ node.content.value }</h${ level }>` );
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
	}

	return stack.join( "" );
}
