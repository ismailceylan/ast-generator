export default class BaseModule
{
	/**
	 * Instance specific name.
	 * 
	 * @type {string}
	 */
	instanceName;

	/**
	 * The abstract byte stream.
	 * 
	 * @type {AsciiByteStream}
	 */
	stream;

	/**
	 * The state of the exact matching.
	 * 
	 * @type {any}
	 */
	state = null;

	/**
	 * The structure scope.
	 * 
	 * @type {object}
	 */
	scope = {}

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
