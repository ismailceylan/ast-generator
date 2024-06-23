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
	 * Sets the instance name and returns the current object.
	 *
	 * @param {string} name - The name to set for the instance.
	 * @returns {object}
	 */
	name( name )
	{
		this.instanceName = name;
		return this;
	}
}
