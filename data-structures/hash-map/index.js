// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.HashMap = function() {
  // Use weak map to encapsulate the entries of each hash map instance
  const data = new WeakMap();

  // Use a strong hash function to avoid key collisions
  const hash = function hash(key) {
    let code = 5381;
    for (let i = 0; i < key.length; i++) {
      code = code * 33 + key.charCodeAt(i);
    }

    return code % 1013;
  }

  // Use a helper class to store each map entry
  class Entry {

    constructor(key, value) {
      this.key = key;
      this.value = value;
    }

    toString() {
      return `{${this.key}: ${this.value}}`;
    }
  }

  class HashMap {

    constructor() {
      // Use an array to store the entries
      data.set(this, []);
    }

    set(key, value) {
      let m = data.get(this);

      let hashCode = hash(key);
      let entry = m[hashCode];

      // Update entry or create a new one
      if (entry) {
        entry.value = value;
      } else {
        m[hashCode] = new Entry(key, value);
      }
    }

    get(key) {
      let m = data.get(this);

      let hashCode = hash(key);
      let entry = m[hashCode];

      if (entry) {
        return entry.value;
      } else {
        return undefined;
      }
    }

    delete(key) {
      let m = data.get(this);

      let hashCode = hash(key);
      let entry = m[hashCode];

      if (entry) {
        // Restore to undefined to mark space as free
        m[hashCode] = undefined;
        return true;
      } else {
        return false;
      }
    }

    has(key) {
      let m = data.get(this);
      let hashCode = hash(key);

      return m[hashCode] !== undefined;
    }

    isEmpty() {
      return this.size() === 0;
    }

    clear() {
      data.set(this, []);
    }

    size() {
      let m = data.get(this);

      // Filter out not used hash code indexes
      return m.filter(e => e !== undefined).length;
    }

    keys() {
      let m = data.get(this);
      return m.filter(e => e !== undefined).map(e => e.key);
    }

    values() {
      let m = data.get(this);
      return m.filter(e => e !== undefined).map(e => e.value);
    }

    toString() {
      let m = data.get(this);
      return `HashMap: [${m.filter(e => e !== undefined).join(', ')}]`;
    }
  }

  return HashMap;
}();

let hm = new myNS.HashMap();

hm.set('bob', 'bob@mail.com'); // [{bob: bob@mail.com}]
hm.set('alice', 'alice@mail.com'); // [{bob: bob@mail.com}, {alice: alice@mail.com}]

hm.keys(); // ['bob', 'alice']
hm.values(); // ['bob@mail.com', 'alice@mail.com']

hm.delete('bob'); // [{alice: alice@mail.com}]

hm.keys(); // ['alice']
hm.values(); // ['alice: alice@mail.com']

hm.has('bob'); // false
