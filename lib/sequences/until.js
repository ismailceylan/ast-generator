import { endline, ending, failed, newline, beginning } from "../constants";
import Sequence from "./sequence";

/**
 * Consumes all characters until the given target is found.
 * 
 * @param {string} target - The string to match against the stream.
 * @returns {Sequence} A new Sequence that represents the scenario.
 */
export default function until( target )
{
	return new Sequence( target, function until({ stream })
	{
		const data = (() =>
		{
			// if we are dealing with multiple targets
			if( Array.isArray( target ))
			{
				function normalizer( item )
				{
					if( item === endline || item === newline )
					{
						return "\n";
					}
					else if( item === ending )
					{
						return stream.raw[ stream.length - 1 ];
					}
					else if( item === beginning )
					{
						return "";
					}
					else if( Array.isArray( item ))
					{
						return item.map( normalizer );
					}

					return item;
				}

				// lets normalize the targets array to find distances of the items
				const normalizedTargets = target
					.map( normalizer )
					// its for constants like space (or nested array defined by dev)
					.flat();

				const distances = stream.closest( normalizedTargets );

				if( distances.length === 0 )
				{
					return undefined;
				}

				return stream.slice( distances[ 0 ][ 1 ] + 1 );
			}
			// endline or newline we consider them same
			else if( target === endline || target === newline )
			{
				// get until \n
				const data = stream.getUntil( "\n" );

				// \n might not be found
				if( data === undefined )
				{
					// get until end of the document
					return stream.slice( stream.raw.length - stream.cursor );
				}
				// found \n
				else
				{
					// return what we found
					return data;
				}
			}
			// wanted everything until the end of the document
			else if( target === ending )
			{
				return stream.slice( stream.raw.length - stream.cursor );
			}
			// wanted specific target
			else
			{
				return stream.getUntil( target );
			}
		})();

		// we still might not found anything
		if( data === undefined )
		{
			// until sequence failed
			return failed;
		}
		else
		{
			// we collected some data and if it wanted to keep on
			// its own ast node, we have to make sure make it happen
			return this.setupSubNode( data );
		}
	});
}
