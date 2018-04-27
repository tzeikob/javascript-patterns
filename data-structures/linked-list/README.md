# The Linked List #

[Back to Home](../../../../)

A linked list is a sequential collection of elements, but unlike arrays in a linked list the elements are not placed contiguously in memory. Each element consist of a node that stores the *element* itself and also a *reference* known as a pointer or link to the next in order element. The first in order element is known as the *head* and if we want get access to a specific element in the list we should iterate the list until we get the desired element.

## Implementation ##

In order to implement a linked list we need a *helper* class to represent the nodes of the list, each node must store the element as a value and the link to the next element in order. The operations a linked list should provide are the following ones,

* append an element to the end of the list
* insert an element at a given position
* remove an element from a given position
* remove an element given the element value itself
* find the index of a given element in the list
* check if the list is empty of elements
* ask for the size of the list as the number of its elements
* print the elements of the list into a string

```
// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.LinkedList = function() {
  class Node {

    constructor(item) {
      this.item = item;
      this.next = null;
    }
  }

  class LinkedList {

    constructor() {
      this.head = null;
      this.length = 0;
    }

    append(item) {
      let itemNode = new Node(item);

      if (this.head === null) {
        this.head = itemNode;
      } else {
        let current = this.head;

        while (current.next !== null) {
          current = current.next;
        }

        current.next = itemNode;
      }

      this.length += 1;

      return this.size();
    }

    insert(item, position) {
      if (position >= 0 && position <= this.size()) {
        let node = new Node(item);
        let current = this.head;

        if (position === 0) {
          this.head = node;
          this.head.next = current;
        } else {
          let index = 0;
          let previous;

          while (index < position) {
            previous = current;
            current = current.next;

            index += 1;
          }

          node.next = current;
          previous.next = node;
        }

        this.length += 1;

        return true;
      } else {
        return false;
      }
    }

    removeAt(position) {
      if (position >= 0 && position < this.size()) {
        let current = this.head;

        if (position === 0) {
          this.head = current.next;
        } else {
          let index = 0;
          let previous = null;

          while(index < position) {
            previous = current;
            current = current.next;

            index += 1;
          }

          previous.next = current.next;
        }

        this.length -= 1;

        return current.item;
      } else {
        return null;
      }
    }

    remove(item) {
      let index = this.indexOf(item);
      return this.removeAt(index);
    }

    indexOf(item) {
      let current = this.head;
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
      this.head = null;
    }

    size() {
      return this.length;
    }

    toString() {
      let items = [];
      let current = this.head;

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

ll.append(6); // [6]
ll.append(6); // [6, 9]
ll.insert(3, 1); // [6, 3, 9]

ll.removeAt(2); // [6, 3]
ll.remove(6); // [3]

ll.clear(); // []
```

[Go to Source](index.js)

## Use Cases ##
* []()

## Considerations ##

### Pros ###
* In contrast with arrays removing an element you don't have to shift elements.
* Linked lists are a best choice if you need a connection between the elements.

### Cons ###
* In order to get access to an element you must iterate the list until you find that element.

[Back to Home](../../../../)
