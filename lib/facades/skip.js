import { Skip } from "../modules";
import { tag } from "../helpers";

/**
 * Creates a new Skip instance and returns it.
 *
 * @param {...*} args - The arguments to pass to the Skip constructor.
 * @returns {Skip} - The tag function.
 */
export default function skip()
{
	return tag(
		new Skip( ...arguments ),
		"Skip " + arguments[ 0 ]
	);
}
