// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.Queue = function() {
  // Use weak map to encapsulate the items of each queue instance
  let data = new WeakMap();

  class Queue {

    constructor() {
      // Use an array to store the items
      data.set(this, []);
    }

    enqueue(item) {
      data.get(this).push(item);
      return this.size();
    }

    dequeue() {
      return data.get(this).shift();
    }

    front() {
      return data.get(this)[0];
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
      return `Queue: [${data.get(this).join(', ')}]`;
    }
  }

  return Queue;
}();

let q = new myNS.Queue();

q.enqueue(3); // [3]
q.enqueue(9); // [3, 9]
q.enqueue(6); // [3, 9, 6]

q.dequeue(); // 3
q.front(); // 9

q.clear(); // []
