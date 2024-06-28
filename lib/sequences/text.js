import { failed } from "../constants";
import Sequence from "./sequence";

/**
 * If it matches with the given target, it will eat the matched part
 * from stream and send it into the latest text node on the AST stack.
 *
 * @param {string} target - The string to match against the stream.
 * @return {Sequence} A new Sequence that represents the scenario.
 */
export default function text( target )
{
	return new Sequence( target, function text({ stream, offset, nodes, astNode })
	{
		if( stream.matches( target ))
		{
			nodes.appendToLatestTextNode( target, stream, offset );
			stream.move( target.length );
			astNode.shift( target.length );

			return true;
		}
		else
		{
			return failed;
		}
	});
}
