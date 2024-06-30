import { failed, newline, beginning, ending, endline } from "../constants";
import Sequence from "./sequence";

/**
 * Tries to softly match the given target string against the stream. That
 * means that even if it matches, the stream cursor won't move.
 * 
 * @param {string|symbol|(string|symbol)[]} target - The string to match against the stream.
 * @return {Sequence} A new Sequence that represents the scenario.
 */
export default function matchFacade( target )
{
	return new Sequence( target, function match({ stream })
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
				const result = matchFacade( item ).run( ...arguments );

				// if result is not failed, that means it matched and match
				// doesn't move cursor so we can return what we have found
				if( result !== failed )
				{
					// match found, lets break the loop, break the matching
					return result;
				}
			}

			// it looks like none of the given possibilities
			// match, so we failed, let's return failed
			return failed;
		}

		// newline (or endline, they are the same) wanted
		if( target === newline || target === endline )
		{
			return stream.matches( "\n" )
				? target
				: failed;
		}
		// beginning wanted
		else if( target === beginning )
		{
			// if cursor is at 0, that means it's beginning
			return stream.cursor === 0
				? beginning
				: failed;
		}
		// ending wanted
		else if( target === ending )
		{
			// if cursor is at the end, that means it's ending
			return stream.cursor >= stream.raw.length - 1
				? ending
				: failed;
		}

		// wanted to match with primitive string
		return stream.matches( target ) || failed;
	});
}
