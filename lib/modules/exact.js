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
	 * @throws {Error} when the target doesn't match the current stream value.
	 */
	run({ scope, stream, astNode } = {})
	{
		const { target } = this;

		if( stream.matches( target ))
		{
			stream.move( target.length );
			astNode.ends( stream.cursor - 1 );

			if( this.instanceName )
			{
				scope[ this.instanceName ] = true;
			}

			return;
		}

		if( ! this.isOptional )
		{
			throw new Error(
				`${ target } doesn't match ${ stream.current }`
			);
		}
	}
}
