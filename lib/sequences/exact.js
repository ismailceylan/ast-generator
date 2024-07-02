import { failed } from "../constants";
import Sequence from "./sequence";

/**
 * Exactly matches the given target string against the stream and
 * moves the cursor.
 * 
 * @param {string} target - The string to match against the stream.
 * @return {Sequence} A new Sequence that represents the scenario.
 */
export default function exact( target )
{
	return new Sequence( target, function exact({ stream })
	{

		// newline (or endline, they are the same) wanted
		if( target === newline || target === endline )
		{
			if( stream.matches( "\n" ))
			{
				stream.move( 1 );
				return target;
			}
			
			return failed;
		}
		// beginning wanted
		else if( target === beginning )
		{
			// if cursor is at 0, that means it's beginning
			return stream.cursor === 0
				// beginning is not edible, lets just return it
				? beginning
				: failed;
		}
		// ending wanted
		else if( target === ending )
		{
			// if cursor is at the end, that means it's ending
			return stream.cursor >= stream.raw.length - 1
				// ending is also not edible, just returning it will be fine
				? ending
				: failed;
		}
		// literal primitive matching wanted
		else if( stream.matches( target ))
		{
			// primitives edible, so cursor should move
			stream.move( target.length );
			return true;
		}

		// if it reached this position that means we didn't handle it so its a failure
		return failed;
		}
	});
}
