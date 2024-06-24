/**
 * @typedef {import('@iceylan/ascii-byte-stream/uncompiled').default} AsciiByteStream
 */
export default class BaseModule
{
	/**
	 * Instance specific name.
	 * 
	 * @type {string}
	 */
	instanceName;

	/**
	 * Whether the instance is optional.
	 * 
	 * @type {boolean|null}
	 */
	isOptional = null;

	/**
	 * Sets the instance name and returns the current object.
	 *
	 * @param {string} name - The name to set for the instance.
	 * @returns {this}
	 */
	name( name )
	{
		this.instanceName = name;
		return this;
	}

	/**
	 * Sets the optional flag to true and returns the current object.
	 *
	 * @return {this} The current object.
	 */
	optional()
	{
		this.isOptional = true;
		return this;
	}
}
