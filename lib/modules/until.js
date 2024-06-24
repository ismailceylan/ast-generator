import { BaseModule } from ".";
import ASTNode from "../ast-node";

/**
 * @typedef {import('@iceylan/ascii-byte-stream/uncompiled').default} AsciiByteStream
 */
export default class Until extends BaseModule
{
	/**
	 * The target of the until matching.
	 * 
	 * @type {string}
	 */
	target;

	/**
	 * Constructor for the Until class.
	 *
	 * @param {type} target - The target of the until matching.
	 * @returns {type} 
	 */
	constructor( target )
	{
		super();
		this.target = target;
	}

	/**
	 * Executes the until matching on the current position of the given stream.
	 *
	 * @param {object} options - The options for the until matching.
	 * @param {object} options.scope - The scope object.
	 * @param {AsciiByteStream} options.stream - The stream to execute the until matching on.
	 * @param {ASTNode} options.astNode - The abstract syntax tree node.
	 * @throws {Error} when the target doesn't match the current stream value.
	 */
	run({ scope, stream, astNode } = {})
	{

	}
}
