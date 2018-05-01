# The Hash Map #

[Back to Home](../../../../)

A hash map is a collection of unordered *key-value* entries also known as *hash table*, but unlike arrays a hash map stores each entry *value* under the *hash* value of the given *key*. A *hash function* is a function that, given a key, will return an address (index) in the table where the value is. So each time we need to get a value from the hash map we actually know where this value is in the table, we don't need to iterate all the values until we find it.

## Implementation ##

In order to implement a hash map we need a *helper* class to be used as the container of the element entries, and that will be the *Array* class. In addition we're gonna use another helper class known as *Entry* in order to keep track on the *key-value* pair for each element in the map. So it's our responsibility to protect the map's data in order to make sure a key used only once. The operations a hash map should provide are the following ones,

* set a value to the map under a given key
* get a value by the given key from the map
* delete a value by the given key from the map
* check if a given key exists in the map
* check if the map is empty of entries
* ask for the size of the map as the number of its entries
* get the keys of the map as an array
* get the values of the map as an array
* clear the map of its entries
* print the entries of the map into a string

```JavaScript
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
```

[Go to Source](index.js)

## Use Cases ##
* [Catalog](catalog.js)

## Considerations ##

### Pros ###
* A hash map is a perfect choice if you need to create indexes of values.
* With hash maps you don't need to traverse all the values to get an entry.
* Hash maps are really fast data structures because of the hashing on the key.

### Cons ###
* Due to the use of hash functions, there will be a possibility of key collisions.
* You may use a universal hash function to avoid collisions.
* If you need to use objects as keys you should provide a hash value for each object.

[Back to Home](../../../../)
