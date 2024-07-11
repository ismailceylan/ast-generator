import { tag } from "./helpers";
import Component from "./component";

export default function component( name, structure )
{
	return tag( new Component( name ), "comp<" + name + ">" )
		.structure( structure );
}
