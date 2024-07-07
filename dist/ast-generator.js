var b = Object.defineProperty;
var S = (n, e, t) => e in n ? b(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var u = (n, e, t) => S(n, typeof e != "symbol" ? e + "" : e, t);
class y {
  /**
   * Initialize the stream.
   * 
   * @param {string} raw string data to get streamed
   */
  constructor(e) {
    /**
     * String data to get streamed.
     * 
     * @type {string}
     */
    u(this, "raw", "");
    /**
     * Current cursor position.
     * 
     * @type {number}
     */
    u(this, "cursor", 0);
    this.raw = e;
  }
  /**
   * Get the current character.
   * 
   * @type {string|undefined}
   */
  get current() {
    return this.raw[this.cursor];
  }
  /**
   * Returns the next character in the stream and advances the cursor.
   *
   * @type {string|undefined}
   */
  get next() {
    return this.raw[++this.cursor];
  }
  /**
   * Returns the previous character in the stream and decrements the cursor.
   *
   * @type {string}
   */
  get prev() {
    return this.raw[--this.cursor];
  }
  /**
   * Checks if the given needle matches starting from the current
   * position.
   * 
   * ```js
   * // v  <-- cursor is here
   * "lorem ipsum".matches( "rem" ); // true
   * ```
   * 
   * @param {string} needle a string to check
   * @returns {boolean}
   */
  matches(e) {
    return this.raw.slice(
      this.cursor,
      this.cursor + e.length
    ) === e;
  }
  /**
   * Checks if the given needle matches before the current position.
   * 
   * ```js
   * //   v  <-- cursor is here
   * "lorem ipsum".before( "lore" ); // true
   * ```
   * 
   * @param {string} needle a string to check
   * @returns {boolean}
   */
  before(e) {
    return this.raw.slice(
      this.cursor - e.length,
      this.cursor
    ) === e;
  }
  /**
   * Checks if the given needle matches after the current position.
   * 
   * ```js
   * // v  <-- cursor is here
   * "lorem ipsum".after( "em" ); // true
   * ```
   *
   * @param {string} needle a string to check
   * @returns {boolean}
   */
  after(e) {
    return this.raw.slice(
      this.cursor + 1,
      this.cursor + e.length + 1
    ) === e;
  }
  /**
   * Calculates there are how many characters between the current
   * position and the specified needle in the stream.
   * 
   * If the needle is not found, Infinity will be returned.
   * 
   * ```js
   * // v  <-- cursor is here
   * "lorem ipsum".distanceTo( "p" ); // 4
   * ```
   *
   * @param {string} needle - The string to search for in the stream.
   * @returns {number} The index representing the distance to the needle.
   */
  distanceTo(e) {
    const t = this.raw.indexOf(
      e,
      this.cursor
    ) - this.cursor - 1;
    return t < 0 ? 1 / 0 : t;
  }
  /**
   * Returns an array of arrays, where each inner array contains a
   * needle and its distance to the current position in the stream.
   * 
   * The returned array is sorted in ascending order based on the distance.
   *
   * @param {Array<string>} needles - An array of needles to find the closest match for.
   * @returns {[string, number][]}
   */
  closest(e) {
    return e.map(
      (t) => [t, this.distanceTo(t)]
    ).sort(
      (t, s) => t[1] - s[1]
    );
  }
  /**
   * Starts a transaction and returns a rollback function.
   *
   * @returns {Function} The rollback function that resets the cursor.
   */
  startTransaction() {
    const { cursor: e } = this;
    function t() {
      this.cursor = e;
    }
    return t.bind(this);
  }
  /**
   * Returns a substring from the current cursor position to the first
   * occurrence of `target`.
   * 
   * If the target is not found, it returns `undefined`.
   *
   * ```js
   * // v  <-- cursor is here
   * "lorem ipsum".getUntil( " " ); // "rem"
   * //    ^  <-- cursor is here now
   * ```
   * 
   * @param {string} target - The string to search for in stream.
   * @returns {string|undefined}
   */
  getUntil(e) {
    const t = this.raw.indexOf(e, this.cursor);
    if (t === -1)
      return;
    const s = this.raw.slice(this.cursor, t);
    return this.cursor += s.length, s;
  }
  /**
   * Slices a portion from the current position of the stream to the
   * given `length`.
   * 
   * ```js
   * // v  <-- cursor is here
   * "lorem ipsum".slice( 3 ); // "rem"
   * //    ^  <-- cursor is here now
   * ```
   *
   * @param {number} length - The length for slicing.
   * @throws {RangeError} when `length` is negative
   * @returns {string} The sliced portion of the raw data.
   */
  slice(e) {
    if (e < 0)
      throw new RangeError(
        `Cannot slice backwards from ${this.cursor} to ${e}.`
      );
    const t = this.raw.slice(
      this.cursor,
      this.cursor + e
    );
    return this.cursor = e === 1 / 0 ? this.raw.length : this.cursor + e, t;
  }
  /**
   * Moves the cursor by the specified length from the current position.
   *
   * ```js
   * //   v  <-- cursor is here
   *   "lorem ipsum".move( 2 );
   * //     ^  <-- cursor is here now
   * ```
   * 
   * @param {number} length - The amount by which to move the cursor.
   * @returns {this}
   */
  move(e) {
    return this.cursor += e, this;
  }
  /**
   * Sets the cursor to the specified position.
   *
   * ```js
   * //   v  <-- cursor is here
   *   "lorem ipsum".moveTo( 1 );
   * //  ^  <-- cursor is here now
   * ```
   * 
   * @param {number} position - The new cursor position.
   * @returns {this}
   */
  moveTo(e) {
    return this.cursor = e, this;
  }
  /**
   * Finds the index of the target in the stream starting from the
   * current cursor position and move the cursor to that position.
   *
   * @param {string} target - The string to search for in the stream.
   * @returns {number} The index of the target in the stream.
   */
  jumpTo(e) {
    return this.cursor = this.raw.indexOf(
      e,
      this.cursor
    );
  }
  /**
   * It eats the given target character set(s) starting from the position
   * of the cursor in the stream until it encounters something else.
   * 
   * The consumed data will be returned.
   *
   * ```js
   * //  v  <-- cursor is here
   * "fooooo ipsum".consume( "o" ); // ooo
   * //     ^  <-- cursor is here now
   * ```
   * 
   * It supports multibyte character targets.
   * 
   * ```js
   * //     v  <-- cursor is here
   * "Lorem 12 12 12 ipsum".consume( "12 " ); // 12 12 12 
   * //              ^  <-- cursor is here now
   * ```
   * 
   * It supports more than one target. With this, it will consume
   * if the characters at the reached position matches with any of
   * the given targets.
   * 
   * ```js
   * //    v  <-- cursor is here
   * "Lorem\s\t\t\s\sipsum".consume([ "\s", "\t" ]); // \s\t\t\s\s
   * //              ^  <-- cursor is here now
   * ```
   * 
   * @param {string|string[]} target - The string(s) to search for in the stream.
   * @returns {string}
   */
  consume(e) {
    let t;
    const s = this.cursor;
    for (Array.isArray(e) || (e = [e]); (t = e.findIndex((o) => this.matches(o))) > -1; )
      this.move(e[t].length);
    return this.raw.slice(s, this.cursor);
  }
}
const M = [
  " ",
  "	",
  `
`,
  "\r",
  "\f",
  "\v",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  "\u2028",
  "\u2029",
  " ",
  " ",
  "　",
  "\uFEFF"
], i = Symbol("failed"), f = Symbol("newline"), p = Symbol("endline"), d = Symbol("beginning"), l = Symbol("ending");
class N {
  constructor() {
    /**
     * Tells if the state machine is idle or not.
     * 
     * @type {boolean}
     */
    u(this, "idle", !0);
    /**
     * Current node.
     * 
     * @type {object}
     */
    u(this, "node", /* @__PURE__ */ Object.create(null));
  }
  name(e) {
    return this.idle = !1, this.node.name = e, this;
  }
  starts(e) {
    return this.idle = !1, this.node.start = e, this;
  }
  ends(e) {
    return this.idle = !1, this.node.end = e, this;
  }
  set(e, t) {
    return this.idle = !1, this.node[e] = t, this;
  }
  /**
   * Flushes the current node and resets the state of the ASTNode.
   *
   * @returns {{}} The flushed node.
   */
  flush() {
    const { node: e } = this;
    return this.idle = !0, this.node = /* @__PURE__ */ Object.create(null), e;
  }
  /**
   * Shifts the start and end points of the node by the given length.
   * 
   * If the node does not have an end point, it is set to the start point or 0.
   * If the node does not have a start point, it is set to the end point or 0.
   *
   * @param {number} length - The amount to shift the start and end points by.
   * @returns {this}
   */
  shift(e) {
    return this.node.end || (this.node.end = this.node.start || 0), this.node.start || (this.node.start = this.node.end || 0), this.node.end += e, this.node.start += e, this;
  }
}
class T extends Array {
  constructor() {
    super(...arguments);
    u(this, "checkpointMonitor", []);
  }
  /**
   * Appends the given raw string to the latest text node in the
   * NodeStack. If there is no latest text node, a new text node
   * is created and added to the NodeStack.
   *
   * @param {string} raw - The string to append to the latest text node.
   * @param {AsciiByteStream} stream - The stream to get the current value from.
   * @param {number} offset - The offset to add to the current cursor position.
   */
  appendToLatestTextNode(t, s, o) {
    if (t === void 0)
      return;
    const r = this.at(-1);
    if ((r == null ? void 0 : r.name) === "text")
      r.value = r.value + t, r.end = r.end + t.length, this.checkpointMonitor.push([r, t]);
    else {
      const h = new N().name("text").set("value", t).starts(o + s.cursor).ends(o + s.cursor + t.length - 1).flush();
      this.push(h), this.checkpointMonitor.push([h, s.current]);
    }
  }
  /**
   * It creates a checkpoint by saving the current length of the
   * array and returns a rollback function. When this function is
   * called, it rolls back the stack to the saved length and removes
   * excess nodes.
   * 
   * @returns {function} A function that rolls back to the saved length.
   */
  createCheckpoint() {
    const t = this.checkpointMonitor.length;
    function s() {
      const o = this.checkpointMonitor.slice(Math.max(t, 0));
      for (const [r, h] of o) {
        const c = r.value.lastIndexOf(h), w = r.value.slice(0, c), m = r.value.slice(c + 1);
        r.value = w + m, r.end -= h.length;
      }
      this.checkpointMonitor.length = t;
    }
    return s.bind(this);
  }
}
class a {
  /**
   * Creates a new sequence.
   * 
   * @param {*} target - The target.
   * @param {SequenceHandler} handler - The handler method.
   */
  constructor(e, t) {
    /**
     * The name of the sequence on the scope.
     * 
     * @type {string}
     */
    u(this, "sequenceName");
    /**
     * The target to match against the stream.
     * 
     * @type {any}
     */
    u(this, "target");
    /**
     * The parent node.
     * 
     * @type {ASTNode}
     */
    u(this, "astNode");
    /**
     * The main node stack.
     * 
     * @type {NodeStack}
     */
    u(this, "nodes");
    /**
     * The offset to apply to the stream cursor.
     * 
     * @type {number}
     */
    u(this, "offset", 0);
    /**
     * The current position of the cursor just before
     * the sequence starts.
     * 
     * @type {number}
     */
    u(this, "cursor");
    /**
     * The component scope.
     * 
     * @type {object}
     */
    u(this, "scope");
    /**
     * The stream.
     * 
     * @type {AsciiByteStream}
     */
    u(this, "stream");
    /**
     * The sequence handler method.
     * 
     * @type {SequenceHandler}
     */
    u(this, "handler");
    /**
     * The name of the sequence on the scope.
     * 
     * @type {string}
     */
    u(this, "sequenceNameOnScope");
    /**
     * The name of the AST node.
     * 
     * @type {string}
     */
    u(this, "astNodeName");
    /**
     * The result of the sequence handler.
     * 
     * @type {SequenceHandlerReturnTypes}
     */
    u(this, "result");
    this.target = e, this.handler = t, this.sequenceName = t.name;
  }
  /**
   * Runs the sequence with the provided payload.
   *
   * @param {SequenceHandlerDependencies} payload - The payload to be assigned to the sequence.
   * @returns {SequenceHandlerReturnTypes} The result of calling the handler with the payload.
   */
  run(e) {
    return Object.assign(this, e), this.result = this.handler.call(this, e), this.setupSubNode(), this.setScope(this.result), this.result;
  }
  /**
   * Assigns the given value to the scope using the sequence name as the key.
   *
   * @template T
   * @param {T} value - The value to be assigned to the scope.
   * @returns {T} The value.
   */
  setScope(e) {
    return this.sequenceNameOnScope && (this.scope[this.sequenceNameOnScope] = e), e;
  }
  /**
   * Sets up an ast sub-node in the current AST node with the given value.
   *
   * @template T
   * @param {T} value - The value to set as the subnode's
   * value. If not provided, the target is used.
   * @returns {T} The value passed to the function.
   */
  setupSubNode(e) {
    if (this.astNodeName && !(this.astNodeName in this.astNode.node)) {
      e = e || this.target;
      const t = new N().set("value", e).starts(this.offset + this.cursor).ends(this.offset + this.cursor + e.length - 1).flush();
      this.astNode.set(this.astNodeName, t);
    }
    return e;
  }
  /**
   * Sets the scope name for the sequence and returns the current object.
   *
   * @param {string} name - The name to set for the scope.
   * @returns {this}
   */
  name(e) {
    return this.sequenceNameOnScope = e, this;
  }
  /**
   * Sets the name of the AST node and returns the current object.
   *
   * @param {string} name - The name to set for the AST node.
   * @return {this} The current object.
   */
  as(e) {
    if (["start", "end", "name"].includes(e))
      throw new ReferenceError(`The name "${e}" is reserved.`);
    return this.astNodeName = e, this;
  }
  text() {
    const e = (() => {
      if (this.result === f)
        return `
`;
      if (typeof this.result == "string")
        return this.result;
    })();
    return e === void 0 ? this : (this.nodes.appendToLatestTextNode(e, this.stream, this.offset), this);
  }
}
class k {
  /**
   * Constructor for initializing the component with a structure.
   *
   * @param {string} name - The name of the component.
   */
  constructor(e) {
    /**
     * The name of the component.
     * 
     * @type {string}
     */
    u(this, "name");
    /**
     * Step by step component structure.
     * 
     * @type {Sequence[]}
     */
    u(this, "sequences");
    this.name = e;
  }
  /**
   * Sets the step by step component structure.
   * 
   * @param {Sequence[]} structure - The step by step component structure.
   */
  structure(e) {
    return this.sequences = e, this;
  }
  /**
   * Executes the component's structure on the given stream.
   *
   * @param {SequenceHandlerDependencies} options - The options for the component.
   * @returns {BasicASTNode|Symbol} The flushed state machine.
   */
  run({ stream: e, nodes: t, offset: s }) {
    if (this.sequences.length === 0)
      return i;
    const { name: o } = this, r = new N(), h = e.startTransaction(), c = t.createCheckpoint(), w = {};
    r.name(o).starts(s + e.cursor);
    for (const m of this.sequences) {
      const x = {
        scope: w,
        stream: e,
        astNode: r,
        nodes: t,
        offset: s,
        cursor: e.cursor
      };
      if (m.run(x) === i)
        return h(), c(), r.flush(), i;
    }
    return r.ends(Math.max(s + e.cursor - 1, r.node.start || 0)).flush();
  }
}
class g {
  /**
   * Constructs a new instance of the Parser class.
   *
   * @param {object} [options] - The options for the parser.
   * @param {Component[]} [options.components] - The component list.
   * @param {number} [options.offset=0] - The cursor offset of the parser.
   */
  constructor({ components: e = [], offset: t = 0 } = {}) {
    /**
     * Component tree.
     * 
     * @type {Component[]}
     */
    u(this, "components");
    /**
     * The cursor offset of the parser.
     * 
     * @type {number}
     */
    u(this, "offset");
    this.components = e, this.offset = t;
  }
  /**
   * Parses the given raw data and returns a abstract syntax tree.
   *
   * @param {string} raw - The raw data to be parsed.
   * @returns {NodeStack} The abstract syntax tree represented as a NodeStack.
   */
  parse(e) {
    const t = new T(), s = new y(e);
    for (; s.current !== void 0; ) {
      let o = !1;
      for (const r of this.components) {
        const h = s.cursor, c = r.run(
          {
            stream: s,
            nodes: t,
            offset: this.offset
          }
        );
        if (c !== i) {
          o = !0, t.push(c), h === s.cursor && (t.appendToLatestTextNode(s.current, s, this.offset), s.next);
          break;
        }
      }
      o || (t.appendToLatestTextNode(s.current, s, this.offset), s.next);
    }
    return t.checkpointMonitor.length = 0, t;
  }
}
function v(n, e) {
  return Object.defineProperty(
    n,
    Symbol.toStringTag,
    { value: e }
  ), n;
}
function L(n, e) {
  return v(new k(n), "comp<" + n + ">").structure(e);
}
function j(n) {
  return new a(n, function({ stream: t }) {
    return n === f ? t.matches(`
`) || t.cursor === 0 ? i : !0 : n === d ? t.cursor === 0 ? i : !0 : n === l ? t.cursor >= t.raw.length - 1 ? i : !0 : !t.matches(n) || i;
  });
}
function A(n) {
  return new a(n, function({ stream: t }) {
    if (Array.isArray(n)) {
      for (const s of n) {
        const o = A(s).run(...arguments);
        if (o !== i)
          return o;
      }
      return i;
    }
    return n === f ? t.matches(`
`) ? n : i : n === p ? t.after(`
`) ? n : i : n === d ? t.cursor === 0 ? d : i : n === l ? t.cursor >= t.raw.length - 1 ? l : i : t.matches(n) || i;
  });
}
function C(n) {
  return new a(n, function({ stream: t, offset: s, nodes: o, astNode: r }) {
    return t.matches(n) ? (o.appendToLatestTextNode(n, t, s), t.move(n.length), r.shift(n.length), !0) : i;
  });
}
function O(n) {
  return new a(n, e);
  function e({ stream: t }) {
    if (Array.isArray(n)) {
      for (const s of n)
        if (O(s).run(...arguments) !== i)
          return s;
      return i;
    }
    if (n === f)
      return t.matches(`
`) ? (t.move(1), n) : i;
    if (n === p) {
      if (t.after(`
`))
        return t.move(1), n;
    } else {
      if (n === d)
        return t.cursor === 0 ? d : i;
      if (n === l)
        return t.cursor >= t.raw.length - 1 ? l : i;
      if (t.matches(n))
        return t.move(n.length), !0;
    }
    return i;
  }
}
function I(n) {
  return new a(n, function({ stream: t }) {
    const s = (() => {
      if (Array.isArray(n)) {
        let o = function(c) {
          return c === p || c === f ? `
` : c === l ? t.raw[t.length - 1] : c === d ? "" : Array.isArray(c) ? c.map(o) : c;
        };
        const r = n.map(o).flat(), h = t.closest(r);
        return h.length === 0 ? void 0 : t.slice(h[0][1] + 1);
      } else if (n === p || n === f) {
        const o = t.getUntil(`
`);
        return o === void 0 ? t.slice(t.raw.length - t.cursor) : o;
      } else return n === l ? t.slice(t.raw.length - t.cursor) : t.getUntil(n);
    })();
    return s === void 0 ? i : this.setupSubNode(s);
  });
}
function F(n) {
  return new a(n, function({ stream: t }) {
    return this.setupSubNode(t.consume(n));
  });
}
export {
  g as Parser,
  d as beginning,
  L as component,
  F as consume,
  l as ending,
  p as endline,
  O as exact,
  i as failed,
  A as match,
  f as newline,
  j as not,
  M as space,
  C as text,
  I as until
};
