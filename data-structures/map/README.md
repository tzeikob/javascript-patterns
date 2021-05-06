# The Map

A map is a collection of unordered *key-value* entries also known as *dictionary*, but unlike arrays a map stores each entry *value* under a given object known as *key*. In a map a key must be *unique* and shown up only once, in other words a map is nothing more than a *set of indexes* each one pointing and referencing to a certain entry value.

## Implementation

In order to implement a map we need a *helper* class to be used as the container of the element entries, and that will be the *Array* class. In addition we're gonna use another helper class known as *Entry* in order to keep track on the *key-value* pair for each element in the map. So it's our responsibility to protect the map's data in order to make sure a key used only once. The operations a map should provide are the following ones,

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

```javascript
// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.Map = function() {
  // Use weak map to encapsulate the entries of each map instance
  const data = new WeakMap();

  // Use a helper class to store the entries
  class Entry {

    constructor(key, value) {
      this.key = key;
      this.value = value;
    }

    toString() {
      return `{${this.key}: ${this.value}}`;
    }
  }

  class Map {

    constructor() {
      // Use an array to store the entries
      data.set(this, []);
    }

    set(key, value) {
      let m = data.get(this);
      let entry = m.find(e => key === e.key);

      if (entry) {
        entry.value = value;
      } else {
        m.push(new Entry(key, value));
      }
    }

    get(key) {
      let m = data.get(this);
      let entry = m.find(e => key === e.key);

      if (entry) {
        return entry.value;
      } else {
        return undefined;
      }
    }

    delete(key) {
      let m = data.get(this);
      let index = m.findIndex(e => key === e.key);

      if (index !== -1) {
        m.splice(index, 1);
        return true;
      } else {
        return false;
      }
    }

    has(key) {
      let m = data.get(this);
      return m.findIndex(e => key === e.key) !== -1;
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

    keys() {
      let m = data.get(this);
      return m.map(e => e.key);
    }

    values() {
      let m = data.get(this);
      return m.map(e => e.value);
    }

    toString() {
      return `Map: [${data.get(this).join(', ')}]`;
    }
  }

  return Map;
}();

let m = new myNS.Map();

m.set('bob', 'bob@mail.com'); // [{bob: bob@mail.com}]
m.set('alice', 'alice@mail.com'); // [{bob: bob@mail.com}, {alice: alice@mail.com}]

m.keys(); // ['bob', 'alice']
m.values(); // ['bob@mail.com', 'alice@mail.com']

m.delete('bob'); // [{alice: alice@mail.com}]

m.keys(); // ['alice']
m.values(); // ['alice: alice@mail.com']
```

[Go to Source](index.js)

## Use Cases
* [Phone Book](phone-book.js)

## Considerations

### Pros
* A map is a perfect choice if you need to create indexes of values.
* Both key and value of the entry can be any type of value like primitive or objects.

### Cons
* Due to the use of an array as the container we should shift elements after each remove.