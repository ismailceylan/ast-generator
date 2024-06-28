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

	/**
	 * Shifts the start and end points of the node by the given length.
	 * 
	 * If the node does not have an end point, it is set to the start point or 0.
	 * If the node does not have a start point, it is set to the end point or 0.
	 *
	 * @param {number} length - The amount to shift the start and end points by.
	 * @returns {this}
	 */
	shift( length )
	{
		if( ! this.node.end )
		{
			this.node.end = this.node.start || 0;
		}
	
		if( ! this.node.start )
		{
			this.node.start = this.node.end || 0;
		}
			
		this.node.end += length;
		this.node.start += length;

		return this;
	}
}
