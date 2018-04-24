const Queue = require('./queue');

let data = new WeakMap();

class CheckList {

  constructor() {
    data.set(this, new Queue());
  }

  add(task) {
    data.get(this).enqueue(task);
  }

  check() {
    return data.get(this).dequeue();
  }

  log() {
    console.log(data.get(this).toString());
  }
}

let cl = new CheckList();

cl.add({id: 'Task A', priority: 2}); // [Task A: 2]
cl.add({id: 'Task B', priority: 1}); // [Task B: 1, Task A: 2]
cl.add({id: 'Task C', priority: 1}); // [Task B: 1, Task C: 1, Task A: 2]

cl.check(); // [Task C: 1, Task A: 2]
