import { Until } from "../modules";
import { tag } from "../helpers";

/**
 * Creates a new until object with the given
 * arguments and returns it.
 *
 * @returns {Until} The tagged until object.
 */
export default function until()
{
	return tag(
		new Until( ...arguments ),
		"Until " + arguments[ 0 ]
	);
}
