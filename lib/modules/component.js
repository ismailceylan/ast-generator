import { failed } from "../constants";
import ASTNode from "../ast-node";
import NodeStack from "../node-stack";
import Sequence from "../sequences/sequence";
import BaseModule from "./base-module";

/**
 * @typedef {import('@iceylan/ascii-byte-stream/uncompiled').default} AsciiByteStream
 */
export default class Component extends BaseModule
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
		super();

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
	 * Executes the component's structure on the given stream.
	 *
	 * @param {object} options - The options for the component.
	 * @param {AsciiByteStream} options.stream - The stream to execute the component on.
	 * @param {NodeStack} options.nodes - The abstract syntax tree nodes.
	 * @param {number} options.offset - The offset of the component.
	 * @return {{}|Symbol} The flushed state machine.
	 */
	run({ stream, nodes, offset } = {})
	{
		if( this.steps.length === 0 )
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
