import { Exact } from "../modules";
import { tag } from "../helpers";

/**
 * Creates a new Exact object with the given
 * arguments and returns it.
 *
 * @returns {Exact} The tagged Exact object.
 */
export default function exact()
{
	return tag(
		new Exact( ...arguments ),
		"Exact " + arguments[ 0 ]
	);
}
