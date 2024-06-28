import { endline, ending, failed, newline } from "../constants";
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
			// endline or newline basically same thing
			if( target === endline || target === newline )
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
