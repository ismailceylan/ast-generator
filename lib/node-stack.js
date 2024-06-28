import ASTNode from "./ast-node";

export default class NodeStack extends Array
{
	checkpointMonitor = [];

	/**
	 * Appends the given raw string to the latest text node in the
	 * NodeStack. If there is no latest text node, a new text node
	 * is created and added to the NodeStack.
	 *
	 * @param {string} raw - The string to append to the latest text node.
	 * @param {AsciiByteStream} stream - The stream to get the current value from.
	 * @param {number} offset - The offset to add to the current cursor position.
	 */
	appendToLatestTextNode( raw, stream, offset )
	{
		if( raw === undefined )
		{
			return;
		}

		const latest = this.at( -1 );

		if( latest?.name === "text" )
		{
			latest.value = latest.value + raw;
			latest.end = latest.end + raw.length;

			this.checkpointMonitor.push([ latest, raw ]);
		}
		else
		{
			const node = ( new ASTNode )
				.name( "text" )
				.set( "value", stream.current )
				.starts( offset + stream.cursor )
				.ends( offset + stream.cursor + raw.length - 1 )
				.flush();
			
			this.push( node );
			this.checkpointMonitor.push([ node, stream.current ]);
		}
	}

	/**
	 * It creates a checkpoint by saving the current length of the
	 * array and returns a rollback function. When this function is
	 * called, it rolls back the stack to the saved length and removes
	 * excess nodes.
	 * 
	 * @returns {function} A function that rolls back to the saved length.
	 */
	createCheckpoint()
	{
		const length = this.checkpointMonitor.length;

		function rollback()
		{
			const data = this.checkpointMonitor.slice( Math.max( length, 0 ));

			for( const [ node, raw ] of data )
			{
				const index = node.value.lastIndexOf( raw );
				const left = node.value.slice( 0, index );
				const right = node.value.slice( index + 1 );

				node.value = left + right;
				node.end -= raw.length;
			}

			this.checkpointMonitor.length = length;
		}

		return rollback.bind( this );
	}
}
