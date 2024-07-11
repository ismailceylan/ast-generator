/**
 * Space characters.
 * 
 * @type {[" ","\t","\n","\r","\f","\v","\u00a0","\u1680","\u2000","\u2001","\u2002","\u2003","\u2004","\u2005","\u2006","\u2007","\u2008","\u2009","\u200a","\u2028","\u2029","\u202f","\u205f","\u3000","\ufeff"]}
 */
export const space = [
	" ", "\t", "\n", "\r", "\f", "\v", "\u00a0", "\u1680", "\u2000", "\u2001", "\u2002", "\u2003", "\u2004", "\u2005", "\u2006", "\u2007", "\u2008", "\u2009", "\u200a", "\u2028", "\u2029", "\u202f", "\u205f", "\u3000", "\ufeff"
];

/**
 * Symbol for a failed state.
 * 
 * @type {Symbol}
 */
export const failed = Symbol( "failed" );

/**
 * Symbol for a skipped state.
 * 
 * @type {Symbol}
 */
export const skipped = Symbol( "skipped" );

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
