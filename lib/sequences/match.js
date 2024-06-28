import { failed, newline, beginning, ending, endline } from "../constants";
import Sequence from "./sequence";

/**
 * Tries to softly match the given target string against the stream. That
 * means that even if it matches, the stream cursor won't move.
 * 
 * @param {string} target - The string to match against the stream.
 * @return {Sequence} A new Sequence that represents the scenario.
 */
export default function match( target )
{
	return new Sequence( target, function match({ stream })
	{
		// newline (or endline, they are the same) wanted
		if( target === newline || target === endline )
		{
			// lets check if it matches with "\n"
			if( stream.matches( "\n" ))
			{
				// return what we found
				return newline;
			}
			// we didn't find newline but we have a one possibility to check
			else
			{
				// if the cursor is at the 0, that means it's
				// beginning and a beginning is kind of a newline
				return stream.cursor === 0
					// stream at the beginning so should return it
					// and since its not "failed" this means it matched
					? beginning
					// we are not at the beginning so we failed
					: failed;
			}
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

		// wanted other than newline, beginning or ending
		return stream.matches( target ) || failed;
	});
}
