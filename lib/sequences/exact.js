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
		if( stream.matches( target ))
		{
			stream.move( target.length );
			
			return true;
		}
		else
		{
			return failed;
		}
	});
}
