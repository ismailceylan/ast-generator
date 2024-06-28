/**
 * Space characters.
 * 
 * @type {[" ", "\t", "\n", "\r", "\0"]}
 */
export const space = [ " ", "\t", "\n", "\r", "\0" ];

/**
 * Symbol for a failed state.
 * 
 * @type {Symbol}
 */
export const failed = Symbol( "failed" );

/**
 * Symbol for the start of a line.
 * 
 * @type {Symbol}
 */
export const newline = Symbol( "newline" );

/**
 * Symbol for the end of a line.
 * 
 * @type {Symbol}
 */
export const endline = Symbol( "endline" );

/**
 * Symbol for the start of data.
 * 
 * @type {Symbol}
 */
export const beginning = Symbol( "beginning" );

/**
 * Symbol for the end of data.
 * 
 * @type {Symbol}
 */
export const ending = Symbol( "ending" );
