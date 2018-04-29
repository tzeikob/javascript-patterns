const DoubleLinkedList = require('./double-linked-list');

class CheckList {

  constructor() {
    this.tasks = new DoubleLinkedList();
  }

  add(task, position) {
    this.tasks.insertAt(task, position);
  }

  check(task) {
    let index = this.tasks.indexOf(task);
    return this.tasks.removeAt(index);
  }

  log() {
    console.log(this.tasks.toString());
  }
}

let cl = new CheckList();

let t1 = {id: 'Task 1', toString() {return this.id}};
let t2 = {id: 'Task 2', toString() {return this.id}};
let t3 = {id: 'Task 3', toString() {return this.id}};

cl.add(t1, 0); // [Task 1]
cl.add(t2, 0); // [Task 2, Task 1]
cl.add(t3, 1); // [Task 2, Task 3, Task 1]

cl.check(t1); // [Task 2, Task 3]
cl.check(t2); // [Task 3]
