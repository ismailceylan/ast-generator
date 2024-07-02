import { beginning, ending, endline, failed, newline } from "../constants";
import Sequence from "./sequence";

/**
 * Exactly matches the given target string against the stream and
 * moves the cursor.
 * 
 * @param {string|string[]} target - The string to match against the stream.
 * @return {Sequence} A new Sequence that represents the scenario.
 */
export default function exactFacade( target )
{
	return new Sequence( target, exact );
	
	function exact({ stream })
	{
		// target can be an array, that means one of the
		// item should match the current stream position
		if( Array.isArray( target ))
		{
			for( const item of target )
			{
				// if we want to keep matching ability with newline,
				// endline, beginning and ending etc. we should clone
				// match sequence and run it like a component and use its result
				const result = exactFacade( item ).run( ...arguments );

				// if result is not failed, that means it matched and match
				// doesn't move cursor so we can return what we have found
				if( result !== failed )
				{
					// match found, lets break the loop, break the matching
					return true;
				}
			}

			// it looks like none of the given possibilities
			// match, so we failed, let's return failed
			return failed;
		}

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
	
}
