const Queue = require('./queue');

class CheckList {

  constructor() {
    this.tasks = new Queue();
  }

  add(task) {
    this.tasks.enqueue(task);
  }

  check() {
    return this.tasks.dequeue();
  }

  log() {
    console.log(this.tasks.toString());
  }
}

let cl = new CheckList();

cl.add({
  id: 'Task A',
  priority: 2
}); // [Task A: 2]

cl.add({
  id: 'Task B',
  priority: 1
}); // [Task B: 1, Task A: 2]

cl.add({
  id: 'Task C',
  priority: 1
}); // [Task B: 1, Task C: 1, Task A: 2]

cl.check(); // [Task C: 1, Task A: 2]
