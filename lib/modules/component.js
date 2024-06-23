import ASTNode from "../ast-node";
import BaseModule from "./base-module";

/**
 * @typedef {import('@iceylan/ascii-byte-stream/uncompiled').default} AsciiByteStream
 */
export default class Component
{
	/**
	 * Step by step component structure.
	 * 
	 * @type {Array<BaseModule>}
	 */
	structure;

	/**
	 * Constructor for initializing the component with a structure.
	 *
	 * @param {object} options - The options for the component.
	 * @param {Array<BaseModule>} options.structure - The step by step component structure.
	 */
	constructor({ structure = []} = {})
	{
		this.structure = structure;
	}

	/**
	 * Executes the component's structure on the given stream.
	 *
	 * @param {object} options - The options for the component.
	 * @param {string} options.name - The name of the component.
	 * @param {AsciiByteStream} options.stream - The stream to execute the component on.
	 * @throws {Error} If any step in the structure fails.
	 * @return {ASTNode} The flushed state machine.
	 */
	run({ name, stream } = {})
	{
		const astNode = new ASTNode;
		const rollbackStream = stream.startTransaction();
		const scope = {}

		astNode
			.name( name )
			.starts( stream.cursor );

		for( const step of this.structure )
		{
			try
			{
				step.run({ scope, stream, astNode });
			}
			catch( e )
			{
				rollbackStream();
				throw e;
			}
		}

		return astNode.flush();
	}
}
