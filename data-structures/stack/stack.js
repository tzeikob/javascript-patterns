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

module.exports = Stack;
