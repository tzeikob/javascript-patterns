# The Stack #

[Back to Home](../../../)

A stack is an ordered collection of elements that follows the *LIFO* (Last In First Out) principle. The addition of new elements or the removal of existing ones takes place at the same time. The end of the stack is known as the top, and the opposite side is known as the base. The newest elements are near the top, and the oldest elements are near the base.

We have several examples of stack structures applied to real world problems like compilers in programming languages, and by computer memory to store variables and method calls.

## Implementation ##

A stack apart from the *encapsulation* of its protected data must provide several *atomic* operations in order to be fully functional in real world cases and problems. First of all the elements of a stack must not be exposed in the outer scope of the stack and no other part of the software should have permissions modify them. In order to protect the data of the stack, we can work either with *Symbols* or with the *WeakMaps* both they offer a clean way to provide the same functionality the private properties give in other object-oriented languages. The operations a stack should provide are the following ones,

* push element onto the top of the stack
* pop element from the top of the stack
* peek the top element of the stack
* ask if stack is empty or not
* clear the stack of its elements
* get the size of the stack as the number of its elements

```
// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.Stack = function() {
  // Use weak maps to encapsulate the items of each stack instance
  let data = new WeakMap();

  class Stack {

    constructor() {
      data.set(this, []);
    }

    push(item) {
      data.get(this).push(item);
      return this.size();
    }

    pop() {
      return data.get(this).pop();
    }

    peek() {
      let size = this.size();
      return data.get(this)[size - 1];
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

    toString() {
      return `Stack: [${data.get(this).join(", ")}]`;
    }
  }

  return Stack;
}();

let s = new myNS.Stack();

s.push(3); // [3]
s.push(9); // [3, 9]
s.push(6); // [3, 9, 6]

s.pop(); // 6
s.peek(); // 9

s.clear(); // []
```

[Go to Source](index.js)

## Use Cases ##
* [Converter](converter.js)

## Considerations ##

### Pros ###
* Using weak maps you can emulate private fields and protect the elements of the stack.
* Using weak maps is more efficient than using regular maps.

### Cons ###
* Regarding the nature of each problem you may have to take a different approach.
* Even using weak maps it might be memory expensive in a large scale problems.

[Back to Home](../../../../)
