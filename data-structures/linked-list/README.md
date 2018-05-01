# The Linked List #

[Back to Home](../../../../)

A linked list is a sequential collection of elements, but unlike arrays in a linked list the elements are not placed contiguously in memory. Each element consist of a node that stores the *element* itself and also a *reference* known as a pointer or link to the next in order element. The first in order element is known as the *head* and if we want get access to a specific element in the list we should iterate the list until we get the desired element.

## Implementation ##

In order to implement a linked list we need a *helper* class to represent the nodes of the list, each node must store the element as a value and the link to the next element in order. The operations a linked list should provide are the following ones,

* insert an element to the end of the list
* insert an element at a given position
* remove an element from a given position
* remove an element given the element value itself
* find the index of a given element in the list
* check if the list is empty of elements
* ask for the size of the list as the number of its elements
* print the elements of the list into a string

```JavaScript
// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.LinkedList = function() {
  // Use weak map to encapsulate the items of each linked list instance
  const data = new WeakMap();

  class Node {

    constructor(item) {
      this.item = item;
      this.next = null;
    }

    dispose() {
      this.item = null;
      this.next = null;
    }
  }

  class LinkedList {

    constructor() {
      data.set(this, {
        head: null,
        length: 0
      });
    }

    insert(item) {
      let node = new Node(item);
      let list = data.get(this);

      if (list.head === null) {
        list.head = node;
      } else {
        let current = list.head;

        while (current.next !== null) {
          current = current.next;
        }

        current.next = node;
      }

      list.length += 1;

      return this.size();
    }

    insertAt(item, position) {
      if (position >= 0 && position <= this.size()) {
        let node = new Node(item);

        let list = data.get(this);
        let current = list.head;

        if (position === 0) {
          node.next = current;
          list.head = node;
        } else {
          let index = 0;
          let previous;

          while (index < position) {
            previous = current;
            current = current.next;

            index += 1;
          }

          previous.next = node;
          node.next = current;
        }

        list.length += 1;

        return true;
      } else {
        return false;
      }
    }

    removeAt(position) {
      if (position > -1 && position < this.size()) {
        let list = data.get(this);
        let current = list.head;

        if (position === 0) {
          list.head = current.next;
        } else {
          let index = 0;
          let previous;

          while (index < position) {
            previous = current;
            current = current.next;

            index += 1;
          }

          previous.next = current.next;
        }

        list.length -= 1;
        let item = current.item;
        current.dispose();

        return item;
      } else {
        return null;
      }
    }

    remove(item) {
      let index = this.indexOf(item);
      return this.removeAt(index);
    }

    indexOf(item) {
      let list = data.get(this);
      let current = list.head;
      let index = 0;

      while (current !== null) {
        if (item === current.item) {
          return index;
        }

        index += 1;
        current = current.next;
      }

      return -1;
    }

    isEmpty() {
      return this.size() === 0;
    }

    clear() {
      let list = data.get(this);
      let current = list.head;

      while (current != null) {
        let previous = current;
        current = current.next;

        previous.dispose();
      }

      list.head = null;
      list.length = 0;
    }

    size() {
      return data.get(this).length;
    }

    toString() {
      let items = [];
      let current = data.get(this).head;

      while (current !== null) {
        items.push(current.item);
        current = current.next;
      }

      return `List: [${items.join(', ')}]`;
    }
  }

  return LinkedList;
}();

let ll = new myNS.LinkedList();

ll.insert(6); // [6]
ll.insert(9); // [6, 9]
ll.insertAt(3, 1); // [6, 3, 9]
ll.insert(6); // [6, 3, 9, 6]

ll.removeAt(1); // [6, 9, 6]
ll.remove(6); // [9, 6]

ll.clear(); // []
```

[Go to Source](index.js)

## Use Cases ##
* [Check List](check-list.js)

## Considerations ##

### Pros ###
* In contrast with arrays removing an element you don't have to shift elements.
* Linked lists are a best choice if you need a connection between the elements.
* If you need to add/remove a lot of elements linked lists are a better option to arrays.

### Cons ###
* In order to get access to an element you must iterate the list until you find that element.

[Back to Home](../../../../)
