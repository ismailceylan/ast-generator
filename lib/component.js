import { failed } from "./constants";
import ASTNode from "./ast-node";
import NodeStack from "./node-stack";
import Sequence from "./sequences/sequence";

/**
 * @typedef {import('@iceylan/ascii-byte-stream/uncompiled').default} AsciiByteStream
 */
export default class Component
{
	/**
	 * The name of the component.
	 * 
	 * @type {string}
	 */
	name;

	/**
	 * Step by step component structure.
	 * 
	 * @type {Sequence[]}
	 */
	sequences;

	/**
	 * Constructor for initializing the component with a structure.
	 *
	 * @param {string} name - The name of the component.
	 */
	constructor( name )
	{
		this.name = name;
	}

	/**
	 * Sets the step by step component structure.
	 * 
	 * @param {Sequence[]} structure - The step by step component structure.
	 */
	structure( structure )
	{
		this.sequences = structure;
		return this;
	}

	/**
	 * @typedef BasicASTNode
	 * @type {Object}
	 * @property {string} name - The name of the component.
	 * @property {number} start - The start position of the component.
	 * @property {number} end - The end position of the component.
	 */
	/**
	 * Executes the component's structure on the given stream.
	 *
	 * @param {{}} options - The options for the component.
	 * @param {AsciiByteStream} options.stream - The stream to execute the component on.
	 * @param {NodeStack} options.nodes - The abstract syntax tree nodes.
	 * @param {number} options.offset - The offset for the stream cursor.
	 * @returns {BasicASTNode|Symbol} The flushed state machine.
	 */
	run({ stream, nodes, offset })
	{
		if( this.sequences.length === 0 )
		{
			return failed;
		}

		const { name } = this;
		const astNode = new ASTNode;
		const rollbackStream = stream.startTransaction();
		const rollbackNodes = nodes.createCheckpoint();
		const scope = {}

		astNode
			.name( name )
			.starts( offset + stream.cursor );

		for( const sequence of this.sequences )
		{
			const result = sequence.run(
			{
				scope,
				stream,
				astNode,
				nodes,
				offset,
				cursor: stream.cursor,
			});

			if( result === failed )
			{
				rollbackStream();
				rollbackNodes();
				astNode.flush();
				
				return failed;
			}
		}

		return astNode
			.ends( Math.max( offset + stream.cursor - 1, astNode.node.start || 0 ))
			.flush();
	}
}
