const data = new WeakMap();

class Node {

  constructor(item) {
    this.item = item;
    this.next = null;
  }
}

class LinkedList {

  constructor() {
    data.set(this, {
      head: null,
      length: 0
    });
  }

  append(item) {
    let itemNode = new Node(item);

    let list = data.get(this);

    if (list.head === null) {
      list.head = itemNode;
    } else {
      let current = list.head;

      while (current.next !== null) {
        current = current.next;
      }

      current.next = itemNode;
    }

    list.length += 1;

    return this.size();
  }

  insert(item, position) {
    if (position >= 0 && position <= this.size()) {
      let node = new Node(item);

      let list = data.get(this);
      let current = list.head;

      if (position === 0) {
        list.head = node;
        list.head.next = current;
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

      list.length += 1;

      return true;
    } else {
      return false;
    }
  }

  removeAt(position) {
    if (position >= 0 && position < this.size()) {
      let list = data.get(this);
      let current = list.head;

      if (position === 0) {
        list.head = current.next;
      } else {
        let index = 0;
        let previous;

        while (index < position) {
          previous = current;
          current = current.next;

          index += 1;
        }

        previous.next = current.next;
      }

      list.length -= 1;

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
    let list = data.get(this);
    let current = list.head;
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
    let list = data.get(this);

    list.head = null;
    list.length = 0;
  }

  size() {
    return data.get(this).length;
  }

  toString() {
    let items = [];
    let current = data.get(this).head;

    while (current !== null) {
      items.push(current.item);
      current = current.next;
    }

    return `List: [${items.join(', ')}]`;
  }
}

module.exports = LinkedList;
