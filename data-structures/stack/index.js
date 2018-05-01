// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.Stack = function() {
  // Use weak map to encapsulate the items of each stack instance
  let data = new WeakMap();

  class Stack {

    constructor() {
      // User an array to store the items
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
      return `Stack: [${data.get(this).join(', ')}]`;
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
