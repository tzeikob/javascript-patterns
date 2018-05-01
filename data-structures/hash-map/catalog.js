const LinkedList = require('./linked-list');

const data = new WeakMap();

const hash = function hash(key) {
  let code = 5381;
  code = code * 33 + key.toUpperCase().charCodeAt(0);

  return code % 1013;
}

class Entry {

  constructor(key, value) {
    this.key = key;
    this.value = value;
  }

  toString() {
    return `{${this.key}: ${this.value}}`;
  }
}

class Catalog {

  constructor() {
    data.set(this, []);
  }

  set(key, value) {
    let c = data.get(this);

    let hashCode = hash(key);
    let list = c[hashCode];

    if (!list) {
      c[hashCode] = new LinkedList();
    }

    c[hashCode].insert(new Entry(key, value));
  }

  get(key) {
    let c = data.get(this);

    let hashCode = hash(key);
    let list = c[hashCode];

    if (list) {
      let current = list.head();

      while (current != null) {
        if (current.item.key === key) {
          return current.item.value;
        }

        current = current.next;
      }
    }

    return undefined;
  }

  delete(key) {
    let c = data.get(this);

    let hashCode = hash(key);
    let list = c[hashCode];

    if (list) {
      let current = list.head();

      while (current != null) {
        if (current.item.key === key) {
          list.remove(current.item);

          if (list.isEmpty()) {
            c[hashCode] = undefined;
          }

          return true;
        }

        current = current.next;
      }
    }

    return false;
  }

  has(key) {
    let c = data.get(this);

    let hashCode = hash(key);
    let list = c[hashCode];

    if (list) {
      let current = list.head();

      while (current != null) {
        if (current.item.key === key) {
          return true;
        }

        current = current.next;
      }
    }

    return false;
  }

  isEmpty() {
    return this.size() === 0;
  }

  clear() {
    data.get(this).filter(l => l !== undefined).forEach(l => l.clear());
    data.set(this, []);
  }

  size() {
    let c = data.get(this);

    let length = c.filter(l => l !== undefined).reduce((counter, l) => {
      return counter + l.size();
    }, 0);

    return length;
  }

  toString() {
    let c = data.get(this);
    return `HashMap: [${c.filter(l => l !== undefined).join(', ')}]`;
  }
}

module.exports = Catalog;
