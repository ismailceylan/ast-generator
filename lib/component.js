import { failed } from "./constants";
import ASTNode from "./ast-node";
import NodeStack from "./node-stack";
import Sequence from "./sequences/sequence";

/**
 * Represent any kind of complex structure.
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
	 * Executes the component's structure on the given stream.
	 *
	 * @param {SequenceHandlerDependencies} options - The options for the component.
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

		for( const [i, sequence] of this.sequences.entries())
		{
			/**
			 * Dependencies of a sequence.
			 * 
			 * @type {SequenceHandlerDependencies}
			 */
			const payload =
			{
				scope,
				stream,
				astNode,
				nodes,
				offset,
				cursor: stream.cursor,
				componentName: name,
				sequenceIndex: i
			}

			if( sequence.run( payload ) === failed )
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

/**
 * @typedef {import('@iceylan/ascii-byte-stream/uncompiled').default} AsciiByteStream
 *//**
 * @typedef SequenceHandlerDependencies
 * @type {Object}
 * @property {{}} scope - The scope of the component.
 * @property {AsciiByteStream} stream - The stream interface.
 * @property {ASTNode} astNode - The AST node interface.
 * @property {NodeStack} nodes - The node stack.
 * @property {number} offset - The offset that should be applied to the current stream.
 * @property {number} cursor - The current cursor value.
 * @property {string} componentName - The name of the component.
 * @property {number} sequenceIndex - The index of the sequence in the component.
 *//**
 * @typedef BasicASTNode
 * @type {Object}
 * @property {string} name - The name of the component.
 * @property {number} start - The start position of the component.
 * @property {number} end - The end position of the component.
 */
