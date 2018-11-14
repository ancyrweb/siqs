var assert = require('assert');
var Siqs = require('../index');

let body = document.createElement('div');
body.id = "body";

const toArray = Array.from;

describe('siqs', function() {
  before(() => {
    document.body.appendChild(body);
  });

  afterEach(() => {
    while (body.firstChild) {
      body.removeChild(body.firstChild);
    }
  });

  describe('new', () => {
    it('should create a div', function() {
      const $el = Siqs.new('div');
      assert.equal(true, $el instanceof Siqs);
      assert.equal("DIV", $el.el().tagName)
    });
    it('should create an array of div', function() {
      const $el = Siqs.new([
        {
          tag: "div",
          props: {
            class: "foo"
          },
        },
        {
          tag: "div",
          props: {
            class: "bar"
          }
        }
      ]);
      assert.equal(true, $el instanceof Siqs);
      assert.equal(2, $el.el().length);
      assert.equal("DIV", $el.el()[0].tagName);
      assert.equal("foo", $el.el()[0].className);
      assert.equal("DIV", $el.el()[1].tagName);
      assert.equal("bar", $el.el()[1].className);
    });
    it('should create a deep element with nested childrens', function() {
      const $el = Siqs.new('div', {
        children: {
          tag: 'h1',
          props: {
            class: "foo",
          },
          children: 'Hello'
        }
      });

      assert.equal(true, $el instanceof Siqs);
      assert.equal("DIV", $el.el().tagName);
      assert.equal(1, $el.el().childNodes.length);
      assert.equal("H1", $el.el().childNodes[0].tagName);
      assert.equal(1, $el.el().childNodes[0].childNodes.length);
      assert.deepEqual(["foo"], Array.from($el.el().childNodes[0].classList));
      assert.equal(Node.TEXT_NODE, $el.el().childNodes[0].childNodes[0].nodeType);
      assert.equal("Hello", $el.el().childNodes[0].childNodes[0].textContent);
    });
    it('should create a deep element with an array of children', function() {
      const $el = Siqs.new('div', {
        children: [
          "Hello",
          {
            tag: "b",
            children: "World"
          },
        ]
      });

      assert.equal(true, $el instanceof Siqs);
      assert.equal("DIV", $el.el().tagName);
      assert.equal(2, $el.el().childNodes.length);
      assert.equal(Node.TEXT_NODE, $el.el().childNodes[0].nodeType);
      assert.equal("Hello", $el.el().childNodes[0].textContent);
      assert.equal(Node.ELEMENT_NODE, $el.el().childNodes[1].nodeType);
      assert.equal("B", $el.el().childNodes[1].tagName);
      assert.equal(Node.TEXT_NODE, $el.el().childNodes[1].childNodes[0].nodeType);
      assert.equal("World", $el.el().childNodes[1].childNodes[0].textContent);
    });
    it('should create a div with an ID', function() {
      const $el = Siqs.new('div', {
        props: {
          id: "foo",
        }
      });

      assert.equal("foo", $el.el().id)
    });
    it('should create a div with classes as string', function() {
      const $el = Siqs.new('div', {
        props: {
          class: "foo bar",
        }
      });

      assert.deepEqual(["foo", "bar"], toArray($el.el().classList));
    });
    it('should create a div with classes as array', function() {
      const $el = Siqs.new('div', {
        props: {
          class: ["foo", "bar"],
        }
      });

      assert.deepEqual(["foo", "bar"], toArray($el.el().classList));
    });
  });
  describe('append', () => {
    it('should append the element', function() {
      const $el = Siqs.new('div');
      const $body = Siqs(body);
      $body.append($el);

      assert.equal(1, body.childNodes.length)
    });
    it('should append all the element', function() {
      const $el = Siqs.new([
        {
          tag: "div",
          props: {
            class: "foo",
          }
        },
        {
          tag: "div",
          props: {
            class: "bar",
          }
        }
      ]);

      const $body = Siqs(body);
      $body.append($el);

      assert.equal(2, body.childNodes.length)
    });
    it('should throw when trying to append multiple elements to multiple elements', function() {
      const $el = Siqs.new([
        { tag: "div" },
        { tag: "div" }
      ]);
      const $el2 = Siqs.new([
        { tag: "div" },
        { tag: "div" }
      ]);

      let msg = null;
      try {
        $el.append($el2);
      } catch (e) {
        msg = e.message;
      }

      assert.equal("Cannot append multiple childs to multiple childs", msg);
    });
  });
  describe('appendTo', () => {
    it('should append the element', function() {
      const $el = Siqs.new('div');
      const $body = Siqs(body);
      $el.appendTo($body);

      assert.equal(1, body.childNodes.length)
    });
    it('should append all the element', function() {
      const $el = Siqs.new([
        {
          tag: "div",
          props: {
            class: "foo",
          }
        },
        {
          tag: "div",
          props: {
            class: "bar",
          }
        }
      ]);

      const $body = Siqs(body);
      $el.appendTo($body);

      assert.equal(2, body.childNodes.length)
    });
    it('should throw when trying to append multiple elements to multiple elements', function() {
      const $el = Siqs.new([
        { tag: "div" },
        { tag: "div" }
      ]);
      const $el2 = Siqs.new([
        { tag: "div" },
        { tag: "div" }
      ]);

      let msg = null;
      try {
        $el.appendTo($el2);
      } catch (e) {
        msg = e.message;
      }

      assert.equal("Cannot append multiple childs to multiple childs", msg);
    });
  });
  describe('default function', () => {
    it('should wrap an element inside Siqs', function() {
      const $body = Siqs(body);
      assert.equal(true, $body instanceof Siqs);
      assert.equal(body, $body.el());
    });

    describe('selector', () => {
      it('should select one element by ID', function() {
        const div = document.createElement('div');
        div.id = "foo";

        body.appendChild(div);

        const i = Siqs('#foo');
        assert.equal(i.el(), div);
      });
      it('should select one element by class', function() {
        const div = document.createElement('div');
        div.className = "foo";

        body.appendChild(div);

        const i = Siqs('.foo');
        assert.equal(i.el(), div);
      });
      it('should return all the element matching the selector', function() {
        const div1 = Siqs.new('div', { props: { class: "foo" }});
        const div2 = Siqs.new('div', { props: { class: "foo" }});
        const div3 = Siqs.new('div', { props: { class: "bar" }});

        div1.appendTo(body);
        div2.appendTo(body);
        div3.appendTo(body);

        const bodyEls = Siqs(body).find('.foo').el();
        assert.deepEqual(bodyEls, [div1.el(), div2.el()]);
      });
      it('should select an element in child', function() {
        const div = Siqs.new('div', { props: { class: "foo" } });
        const div1child = Siqs.new('div', { props: { class: "foo-bar" } });
        const div2 = Siqs.new('div', { props: { class: "bar" } });

        div.append(div1child.el());
        body.appendChild(div.el());
        body.appendChild(div2.el());

        assert.equal(div.find('.foo-bar').el(), div1child.el());
        assert.equal(div2.find('.foo-bar').el(), null);
      });
    });
  });

});