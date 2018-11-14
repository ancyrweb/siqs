const isArray = Array.isArray;
const join = Array.prototype.join;
const isString = (val) => typeof val === "string";

const Siqs = function(allEl) {
  if (this instanceof Siqs === false) {
    if (isString(allEl)) {
      return Siqs.find(allEl);
    }

    return new Siqs(allEl);
  }

  if (!isArray(allEl))
    allEl = [allEl];

  this.el = () => {
    if (allEl.length === 0)
      return null;
    else if (allEl.length === 1)
      return allEl[0];
    return allEl;
  };

  this.allEl = () => allEl;
  this.singleOrThrow = (str) => singleOrThrow(allEl, str);
};

/**
 * append the parameter to the current element
 * @param el
 */
Siqs.prototype.append = function(el) {
  const domEls = raw(el);
  if (isArray(domEls)) {
    domEls.map(el => this.singleOrThrow("Cannot append multiple childs to multiple childs").appendChild(el));
    return;
  }

  this.el().appendChild(domEls);
};

/**
 * Append the current element to the parameter
 * @param el
 */
Siqs.prototype.appendTo = function(el) {
  this.allEl().map(
    e => singleOrThrow(raw(el), "Cannot append multiple childs to multiple childs").appendChild(e)
  );
};

/**
 * Return an element matched by the selector
 * @type {function(*=)}
 */
Siqs.prototype.find = Siqs.find = function (selector) {
  let container = document;
  if (this instanceof Siqs) {
    container = this.el();
  }

  return new Siqs(Array.from(container.querySelectorAll(selector)));
};

/**
 * Creates a new DOM element
 * @param tag
 * @param attr
 * @returns {Siqs}
 */
Siqs.new = (tag, attr) => {
  return new Siqs(
    isArray(tag) ? tag.map(createElement) : createElement({ tag, ...attr })
  );
};

/**
 * Creates a DOM element
 * @param attr
 * @returns {Node}
 */
const createElement = (attr) => {
  if (typeof attr === "string")
    return document.createTextNode(attr);

  const el = document.createElement(attr.tag);
  const props = attr && attr.props || {};

  for (let prop in props) {
    if (props.hasOwnProperty(prop)) {
      if (prop === "class") {
        el.className = createClassName(props[prop]);
      } else {
        el[prop] = props[prop];
      }
    }
  }

  if (attr && attr.children) {
    if (isArray(attr.children)) {
      for (let i = 0; i < attr.children.length; i++) {
        el.appendChild(createElement(attr.children[i]));
      }
    } else {
      el.appendChild(createElement(attr.children));
    }
  }

  return el;
};

const createClassName = (val) => isArray(val) ? join.call(val, " ") : val;
const raw = (el) => el instanceof Siqs ? el.el() : el;
const singleOrThrow = (el, msg) => {
  if (!isArray(el))
    return el;

  if (el.length === 1)
    return el[0];


  throw new Error(msg)
};

module.exports = Siqs;