export default class ASTNode
{
	/**
	 * Tells if the state machine is idle or not.
	 * 
	 * @type {boolean}
	 */
	idle = true;

	/**
	 * Current node.
	 * 
	 * @type {object}
	 */
	node = Object.create( null );

	name( name )
	{
		this.idle = false;
		this.node.name = name;

		return this;
	}

	starts( index )
	{
		this.idle = false;
		this.node.start = index;

		return this;
	}

	ends( index )
	{
		this.idle = false;
		this.node.end = index;

		return this;
	}

	set( name, value )
	{
		this.idle = false;
		this.node[ name ] = value;

		return this;
	}

	/**
	 * Flushes the current node and resets the state of the ASTNode.
	 *
	 * @returns {{}} The flushed node.
	 */
	flush()
	{
		const { node } = this;

		this.idle = true;
		this.node = Object.create( null );

		return node;
	}
}
