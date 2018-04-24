# The Queue #

[Back to Home](../../../../)

A queue is an ordered collection of elements that follows the *FIFO* (First In First Out) principle. The addition of new elements takes place at the tail, on the other way the removal takes place at the front of the queue. The end of the queue is known as the *tail*, and the opposite side is known as the *front*. The newest elements are near the end of the queue, and the oldest elements are near the front side.

We have several examples of queue structures applied to real world problems like printing queues of documents in computers or priority job tasks that should be executed in a certain order.

## Implementation ##

A queue apart from the *encapsulation* of its protected data must provide several *atomic* operations in order to be fully functional in real world cases and problems. First of all the elements of a queue must not be exposed in the outer scope of the queue and no other parts of the code should have permissions to modify them. In order to protect the data of the queue, we can work either with *Symbols* or with the *WeakMaps* both they offer a clean way to provide the same functionality the private properties give in other object-oriented languages. The operations a queue should provide are the following ones,

* enqueue element to the end of the queue
* dequeue element from the front of the queue
* front to get the front element of the queue
* ask if queue is empty or not
* clear the queue of its elements
* get the size of the queue as the number of its elements

```
// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.Queue = function() {
  // Use weak map to encapsulate the items of each queue instance
  let data = new WeakMap();

  class Queue {

    constructor() {
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
```

[Go to Source](index.js)

## Use Cases ##
* [Check List](check-list.js)

## Considerations ##

### Pros ###
* Using weak maps you can emulate private fields and protect the elements of the queue.
* Using weak maps is more efficient than using regular maps.

### Cons ###
* Regarding the nature of each problem you may have to take a different approach.
* Even using weak maps it might be memory expensive in a large scale problems.

[Back to Home](../../../../)
