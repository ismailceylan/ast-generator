import AsciiByteStream from "@iceylan/ascii-byte-stream/uncompiled";
import { failed } from "./constants";
import Component from "./component";
import NodeStack from "./node-stack";

export default class Parser
{
	/**
	 * Component tree.
	 * 
	 * @type {Component[]}
	 */
	components;

	/**
	 * The cursor offset of the parser.
	 * 
	 * @type {number}
	 */
	offset;

	/**
	 * Constructs a new instance of the Parser class.
	 *
	 * @param {object} [options] - The options for the parser.
	 * @param {Component[]} [options.components] - The component list.
	 * @param {number} [options.offset=0] - The cursor offset of the parser.
	 */
	constructor({ components = [], offset = 0 } = {})
	{
		this.components = components;
		this.offset = offset;
	}

	/**
	 * Parses the given raw data and returns a abstract syntax tree.
	 *
	 * @param {string} raw - The raw data to be parsed.
	 * @returns {NodeStack} The abstract syntax tree represented as a NodeStack.
	 */
	parse( raw )
	{
		const nodes = new NodeStack;
		const stream = new AsciiByteStream( raw );
		
		// if stream has bytes, we should continue undoubtedly
		while( stream.current !== undefined )
		{
			// we have to know if we have a component
			// that matched and parsed the stream
			let componentFound = false;

			// at worst scenario, we have to loop through
			// all components for current stream position
			for( const component of this.components )
			{
				// we should observe stream to prevent infinite loop
				const cursorPosition = stream.cursor;

				// lets run the component and get the result
				const nodeOrSignal = component.run(
				{
					stream,
					nodes,
					offset: this.offset
				});

				// if current component failed
				if( nodeOrSignal === failed )
				{
					// we should continue with next component
					// without changing the cursor position
					continue;
				}
				// if current component successful
				else
				{
					// that means the component has already
					// eaten as many bytes as it needs

					componentFound = true;
					
					// we should add the ast node to the node stack
					nodes.push( nodeOrSignal );

					// component matched but it doesn't eat any bytes
					// we should handle current byte to not lead infinite loop
					if( cursorPosition === stream.cursor )
					{
						nodes.appendToLatestTextNode( stream.current, stream, this.offset );
						stream.next;
					}

					// component eaten bytes and moved the cursor until a point
					// that it doesn't interested anymore, meaning, the cursor is 
					// already a position that we need to try components from the
					// beginning, so lets break this loop
					break;
				}
			}

			// we could know when a component was found but we couldn't know if all
			// the components failed for current stream position in the components
			// loop, but, at this point we know that the component wasn't found
			if( ! componentFound )
			{
				// that means, current stream position was not part of any component
				// so we should add it to the node stack as a text node
				nodes.appendToLatestTextNode( stream.current, stream, this.offset );

				// and move the cursor
				stream.next;
			}
		}

		// we should clear the checkpoint monitor
		// because we don't need it anymore
		nodes.checkpointMonitor.length = 0;

		return nodes;
	}
}
