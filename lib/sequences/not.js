import { failed, newline, beginning, ending } from "../constants";
import Sequence from "./sequence";

/**
 * Tries to softly not match the given target string against
 * the stream.
 * 
 * It won't move the cursor.
 * 
 * @param {string} target - The string to not match against the stream.
 * @return {Sequence} A new Sequence that represents the scenario.
 */
export default function not( target )
{
	return new Sequence( target, function not({ stream })
	{
		// newline wanted
		if( target === newline )
		{
			// lets check if it matches with "\n"
			if( stream.matches( "\n" ))
			{
				// it shouldn't match with "\n"
				return failed;
			}
			// we didn't find newline its OK but we have a one possibility to check
			else
			{
				// if the cursor is at the 0, that means it's
				// beginning and a beginning is kind of a newline
				return stream.cursor === 0
					// stream at the beginning
					? failed
					// we are not at the beginning so we OK
					: true;
			}
		}
		// beginning wanted
		else if( target === beginning )
		{
			// if cursor is at 0, that means it's beginning
			return stream.cursor === 0
				// its a failure
				? failed
				// we are not at the beginning so we OK
				: true;
		}
		// ending wanted
		else if( target === ending )
		{
			// if cursor is at the end, that means it's ending
			return stream.cursor >= stream.raw.length - 1
				// its a failure
				? failed
				: true;
		}

		// wanted to not match other than newline, beginning or ending
		return ! stream.matches( target ) || failed;
	});
}
