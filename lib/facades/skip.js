import { Skip } from "../modules";
import { tag } from "../helpers";

export default function skip()
{
	return tag(
		new Skip( ...arguments ),
		"Skip " + arguments[ 0 ]
	);
}
