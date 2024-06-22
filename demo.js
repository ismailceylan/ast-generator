import { Parser, component } from "./lib";

const htmlParser = new Parser(
{
	components:
	{
		bold: component(
		{
			structure:
			[
				
			]
		})
	}
});

const ast = htmlParser.parse( "lorem <b>ipsum</b> dolor." );

console.log( htmlParser, ast );
