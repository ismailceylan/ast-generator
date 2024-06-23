import { Exact } from "../modules";
import { tag } from "../helpers";

export default function exact()
{
	return tag(
		new Exact( ...arguments ),
		"Exact " + arguments[ 0 ]
	);
}
