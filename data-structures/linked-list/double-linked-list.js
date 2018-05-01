const data = new WeakMap();

class Node {

  constructor(item) {
    this.item = item;
    this.previous = null;
    this.next = null;
  }

  dispose() {
    this.item = null;
    this.previous = null;
    this.next = null;
  }
}

class DoubleLinkedList {

  constructor() {
    data.set(this, {
      head: null,
      tail: null,
      length: 0
    });
  }

  insertAt(item, position) {
    if (position >= 0 && position <= this.size()) {
      let node = new Node(item);

      let list = data.get(this);
      let current = list.head;

      if (position === 0) {
        if (list.head === null) {
          list.head = node;
          list.tail = node;
        } else {
          node.next = current;
          current.previous = node;
          list.head = node;
        }
      } else if (position === this.size()) {
        current = list.tail;
        current.next = node;
        node.previous = current;
        list.tail = node;
      } else {
        let index = 0;
        let previous;

        while (index < position) {
          previous = current;
          current = current.next;

          index += 1;
        }

        node.next = current;
        node.previous = previous;

        previous.next = node;
        current.previous = node;
      }

      list.length += 1;

      return true;
    } else {
      return false;
    }
  }

  removeAt(position) {
    if (position > -1 && position < this.size()) {
      let list = data.get(this);
      let current = list.head;

      if (position === 0) {
        list.head = current.next;

        if (this.size() === 1) {
          list.tail = null;
        } else {
          list.head.previous = null;
        }
      } else if (position === this.size() - 1) {
        current = list.tail;
        list.tail = current.previous;
        list.tail.next = null;
      } else {
        let index = 0;
        let previous;

        while (index < position) {
          previous = current;
          current = current.next;

          index += 1;
        }

        previous.next = current.next;
        current.next.previous = previous;
      }

      list.length -= 1;
      let item = current.item;
      current.dispose();

      return item;
    } else {
      return undefined;
    }
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

  lastIndexOf(item) {
    let list = data.get(this);
    let current = list.tail;
    let index = this.size() - 1;

    while (current !== null) {
      if (item === current.item) {
        return index;
      }

      index -= 1;
      current = current.previous;
    }

    return -1;
  }

  isEmpty() {
    return this.size() === 0;
  }

  clear() {
    let list = data.get(this);
    let current = list.head;

    while (current != null) {
      let previous = current;
      current = current.next;

      previous.dispose();
    }

    list.head = null;
    list.tail = null;
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

module.exports = DoubleLinkedList;
