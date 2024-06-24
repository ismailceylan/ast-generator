import { BaseModule } from ".";
import ASTNode from "../ast-node";

/**
 * @typedef {import('@iceylan/ascii-byte-stream/uncompiled').default} AsciiByteStream
 */
export default class Exact extends BaseModule
{
	/**
	 * The target of the exact matching.
	 * 
	 * @type {string}
	 */
	target;

	/**
	 * Constructor for the Exact class.
	 *
	 * @param {type} target - The target of the exact matching.
	 * @returns {type} 
	 */
	constructor( target )
	{
		super();
		this.target = target;
	}

	/**
	 * Executes the exact matching on the current position of the given stream.
	 *
	 * @param {object} options - The options for the exact matching.
	 * @param {object} options.scope - The scope object.
	 * @param {AsciiByteStream} options.stream - The stream to execute the exact matching on.
	 * @param {ASTNode} options.astNode - The abstract syntax tree node.
	 */
	run({ scope, stream, astNode } = {})
	{
		const result =
		{
			consumed: stream.consume( this.target ),
			endedWith: stream.current
		}

		astNode.ends( stream.cursor - 1 );

		if( this.instanceName )
		{
			scope[ this.instanceName ] = result;
		}
	}
}
