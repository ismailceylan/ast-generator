import ASTNode from "../ast-node";
import NodeStack from "../node-stack";

/**
 * @typedef {import('@iceylan/ascii-byte-stream/uncompiled').default} AsciiByteStream
 *//**
 * Represents a step of reading a sequence of bytes from the stream.
 */
export default class Sequence
{
	/**
	 * The name of the sequence on the scope.
	 * 
	 * @type {string}
	 */
	sequenceName;

	/**
	 * The target to match against the stream.
	 * 
	 * @type {any}
	 */
	target;

	/**
	 * The parent node.
	 * 
	 * @type {ASTNode}
	 */
	astNode;

	/**
	 * The main node stack.
	 * 
	 * @type {NodeStack}
	 */
	nodes;

	/**
	 * The offset to apply to the stream cursor.
	 * 
	 * @type {number}
	 */
	offset = 0;

	/**
	 * The current position of the cursor just before
	 * the sequence starts.
	 * 
	 * @type {number}
	 */
	cursor;

	/**
	 * The component scope.
	 * 
	 * @type {object}
	 */
	scope;

	/**
	 * The stream.
	 * 
	 * @type {AsciiByteStream}
	 */
	stream;

	/**
	 * The sequence handler method.
	 * 
	 * @type {SequenceHandler}
	 */
	handler;

	/**
	 * The name of the sequence on the scope.
	 * 
	 * @type {string}
	 */
	sequenceNameOnScope;

	/**
	 * The name of the AST node.
	 * 
	 * @type {string}
	 */
	astNodeName;

	/**
	 * @typedef SequenceHandlerProps
	 * @property {Number} options.offset - The offset to apply to the stream cursor.
	 * @property {{}} options.scope - The scope object.
	 * @property {AsciiByteStream} options.stream - The stream to execute the exact matching on.
	 * @property {ASTNode} options.astNode - The abstract syntax tree node.
	 * @property {NodeStack} options.nodes - The abstract syntax tree nodes.
	 */

	/**
	 * @callback SequenceHandler
	 * @this {Sequence}
	 * @param {SequenceHandlerProps} options - The payload to be assigned to the sequence.
	 * @returns {boolean|Symbol} The result of calling the handler with the payload.
	 */

	/**
	 * Creates a new sequence.
	 * 
	 * @param {*} target - The target.
	 * @param {SequenceHandler} handler - The handler method.
	 */
	constructor( target, handler )
	{
		this.target = target;
		this.handler = handler;
		this.sequenceName = handler.name;
	}

	/**
	 * Runs the sequence with the provided payload.
	 *
	 * @param {object} payload - The payload to be assigned to the sequence.
	 * @returns {any} The result of calling the handler with the payload.
	 */
	run( payload )
	{
		Object.assign( this, payload );

		const result = this.handler.call( this, payload );

		this.setupSubNode();

		return this.setScope( result );
	}

	/**
	 * Assigns the given value to the scope using the sequence name as the key.
	 *
	 * @template T
	 * @param {T} value - The value to be assigned to the scope.
	 * @returns {T} The value.
	 */
	setScope( value )
	{
		if( this.sequenceNameOnScope )
		{
			this.scope[ this.sequenceNameOnScope ] = value;
		}

		return value;
	}

	/**
	 * Sets up an ast sub-node in the current AST node with the given value.
	 *
	 * @template T
	 * @param {T} value - The value to set as the subnode's
	 * value. If not provided, the target is used.
	 * @returns {T} The value passed to the function.
	 */
	setupSubNode( value )
	{
		if( this.astNodeName && ! ( this.astNodeName in this.astNode.node ))
		{
			value = value || this.target;

			const matchNode = ( new ASTNode )
				.set( "value", value )
				.starts( this.offset + this.cursor )
				.ends( this.offset + this.cursor + value.length - 1 )
				.flush();

			this.astNode.set( this.astNodeName, matchNode );
		}

		return value;
	}

	/**
	 * Sets the scope name for the sequence and returns the current object.
	 *
	 * @param {string} name - The name to set for the scope.
	 * @returns {this}
	 */
	name( name )
	{
		this.sequenceNameOnScope = name;
		return this;
	}

	/**
	 * Sets the name of the AST node and returns the current object.
	 *
	 * @param {string} name - The name to set for the AST node.
	 * @return {this} The current object.
	 */
	as( name )
	{
		if([ "start", "end", "name" ].includes( name ))
		{
			throw new ReferenceError( `The name "${ name }" is reserved.` );
		}

		this.astNodeName = name;
		return this;
	}
}
