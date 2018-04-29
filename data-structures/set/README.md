# The Set #

[Back to Home](../../../../)

A set is a collection of unordered elements, but unlike arrays a set consists only of unique elements. Each set can be subject of mathematical operations like *union*, *intersection*, *difference* and so on. A set without elements is also known as a *null set* or an *empty set*.

## Implementation ##

In order to implement a set we need a *helper* class to be used as the container of the elements, and that will be the *Array* class. So it's our responsibility to protect the set's data in order to make sure each element shown up only once in the set. The operations a set should provide are the following ones,

* add an element to the set
* remove an element from the set
* check if a given element exists in the set
* check if the set is empty of elements
* ask for the size of the set as the number of its elements
* get the values of the set as an array
* clear the set of its elements
* print the elements of the set into a string

```
// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.Set = function() {
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

let o1 = {id: 1, name: "Bob"};
let o2 = {id: 2, name: "Alice"};

s.add(o1); // [{id: 1, name: "Bob"}]
s.add(o1); // [{id: 1, name: "Bob"}]

s.add(o2); // [{id: 1, name: "Bob"}, {id: 2, name: "Alice"}]
s.remove(o1); // [{id: 2, name: "Alice"}]

s.clear(); // []
```

[Go to Source](index.js)

## Use Cases ##
* [Set Operator](set-operator.js)

## Considerations ##

### Pros ###
* A set is a perfect choice if you need to filter out duplicate values.
* An element can be any type of value like primitive or objects.

### Cons ###
* Due to the use of an array as the container we should shift elements after each remove.

[Back to Home](../../../../)
