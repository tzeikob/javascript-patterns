// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.Set = function() {
  // Use weak map to encapsulate the items of each set instance
  const data = new WeakMap();

  class Set {

    constructor() {
      data.set(this, []);
    }

    add(item) {
      if (this.has(item)) {
        return false;
      }

      data.get(this).push(item);

      return true;
    }

    remove(item) {
      if (!this.has(item)) {
        return false;
      }

      let values = data.get(this);
      let index = values.indexOf(item);
      values.splice(index, 1);

      return true;
    }

    has(item) {
      return data.get(this).indexOf(item) !== -1;
    }

    isEmpty() {
      return this.size() === 0;
    }

    clear() {
      data.set(this, []);
    }

    size() {
      return data.get(this).length;
    }

    values() {
      return data.get(this);
    }

    toString() {
      return `Set: [${data.get(this).join(', ')}]`;
    }
  }

  return Set;
}();

let s = new myNS.Set();

let o1 = {
  id: 1,
  name: "Bob"
};

let o2 = {
  id: 2,
  name: "Alice"
};

s.add(o1); // [{id: 1, name: "Bob"}]
s.add(o1); // [{id: 1, name: "Bob"}]

s.add(o2); // [{id: 1, name: "Bob"}, {id: 2, name: "Alice"}]
s.remove(o1); // [{id: 2, name: "Alice"}]

s.clear(); // []
