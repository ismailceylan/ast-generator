import { failed, skipped } from "../constants";
import ASTNode from "../ast-node";
import NodeStack from "../node-stack";

/**
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
	 * The result of the sequence handler.
	 * 
	 * @type {SequenceHandlerReturnTypes}
	 */
	result;

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
	 * @param {SequenceHandlerDependencies} payload - The payload to be assigned to the sequence.
	 * @returns {SequenceHandlerReturnTypes} The result of calling the handler with the payload.
	 */
	run( payload )
	{
		Object.assign( this, payload );
		const currentChar = this.stream.current;

		if( this.checkConditions())
		{
			/**
			 * @type {SequenceHandlerReturnTypes}
			 */
			this.result = this.handler.call( this, payload );

			this.setupSubNode();
			this.setScope( this.result );
		}
		else
		{
			this.result = skipped;
		}

		if( this.shouldLog )
		{
			const { sequenceName } = this;
			const { componentName, sequenceIndex } = payload;

			console.group
			(
				componentName + ">" + 
				"[" + ( sequenceIndex + 1 ) + "]" + sequenceName +
				"(" + JSON.stringify( this.target, replacer ) + ") => " +
				JSON.stringify( currentChar )
			);

			console.log(this.result,  );
			console.groupEnd();

			function replacer( _key, value )
			{
				return typeof value === "symbol"
					? value.toString().replace( /Symbol\((.*)\)/, "$1" )
					: value;
			}
		}

		// if it's optional then that means failures should be ignored
		if( this.isOptional )
		{
			return this.result === failed
				// still keep the failure but more soft way
				? false
				// it's not failure so there is nothing to do
				// with the optional lets return the result
				: this.result;
		}

		return this.result;
	}

	/**
	 * It marks the function as optional and returns the current sequence.
	 *
	 * @returns {this}
	 */
	optional()
	{
		this.isOptional = true;
		return this;
	}

	/**
	 * Marks the function to enable logging and returns the current object.
	 *
	 * @returns {this}
	 */
	log()
	{
		this.shouldLog = true;
		return this;
	}

	/**
	 * Adds an if statement that checks if the given scopeName equals the
	 * given scopeVal on the current scope.
	 *
	 * @overload
	 * @param {string} scopeName - The name of the scope.
	 * @param {any} scopeVal - The value of the scope.
	 * @returns {this} The current object.
	 *//**
	 * Adds given callback into the condition stack. The callback will 
	 * receive the current scope on it can performs what it wants and
	 * after that it should return true or false.
	 * 
	 * @overload
	 * @param {function} cback 
	 * @returns {this}
	 */
	if()
	{
		if( ! this.conditionStack )
		{
			this.conditionStack = [];
		}

		if( typeof arguments[ 0 ] === "function" )
		{
			this.conditionStack.push( arguments[ 0 ]);
		}
		else if(
			arguments.length === 2 &&
			typeof arguments[ 0 ] === "string" &&
			arguments[ 1 ] !== undefined
		)
		{
			this.conditionStack.push(({ scope }) =>
			{
				if( Array.isArray( arguments[ 1 ]))
				{
					return arguments[ 1 ].includes( scope[ arguments[ 0 ]]);
				}

				return scope[ arguments[ 0 ]] === arguments[ 1 ];
			});
		}
		
		return this;
	}

	/**
	 * Checks the conditions in the condition stack against the
	 * given scope.
	 *
	 * @returns {boolean} Returns true if all conditions in the stack
	 * are true, otherwise false.
	 */
	checkConditions()
	{
		return ( this.conditionStack || []).reduce(
			( bool, cb ) => bool && cb( this ),
			true
		);
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
			value = value || this.result || "";

			const matchNode = ( new ASTNode )
				.set( "value", value )
				.starts( this.offset + this.cursor )
				.ends( this.offset + this.cursor + ( value?.length || 1 ) - 1 )
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
			throw new ReferenceError( `The word "${ name }" is reserved.` );
		}

		this.astNodeName = name;
		return this;
	}
}

/**
 * @typedef {import('../component').SequenceHandlerDependencies} SequenceHandlerDependencies
 * @typedef {import('@iceylan/ascii-byte-stream/uncompiled').default} AsciiByteStream
 *//**
 * @callback SequenceHandler
 * @this {Sequence}
 * @param {SequenceHandlerDependencies} options - The payload to be assigned to the sequence.
 * @returns {SequenceHandlerReturnTypes} The result of calling the handler with the payload.
 *//**
 * @typedef {true|string|Symbol} SequenceHandlerReturnTypes
 */