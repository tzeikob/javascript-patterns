let data = new WeakMap();

class Queue {

  constructor() {
    data.set(this, []);
  }

  enqueue(item) {
    let enqueued = data.get(this);
    let added = false;

    for (let i = 0; enqueued.length; i++) {
      if (item.priority < enqueued[i].priority) {
        enqueued.splice(i, 0, item);
        added = true;

        break;
      }
    }

    if (!added) {
      enqueued.push(item);
    }

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
    let output = data.get(this).map(item => `${item.id}: ${item.priority}`);

    return `Queue: [${output.join(', ')}]`;
  }
}

module.exports = Queue;
