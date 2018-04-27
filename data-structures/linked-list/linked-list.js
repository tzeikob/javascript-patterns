class Node {

  constructor(item) {
    this.item = item;
    this.next = null;
  }
}

class LinkedList {

  constructor() {
    this.head = null;
    this.length = 0;
  }

  append(item) {
    let itemNode = new Node(item);

    if (this.head === null) {
      this.head = itemNode;
    } else {
      let current = this.head;

      while (current.next !== null) {
        current = current.next;
      }

      current.next = itemNode;
    }

    this.length += 1;

    return this.size();
  }

  insert(item, position) {
    if (position >= 0 && position <= this.size()) {
      let node = new Node(item);
      let current = this.head;

      if (position === 0) {
        this.head = node;
        this.head.next = current;
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

      this.length += 1;

      return true;
    } else {
      return false;
    }
  }

  removeAt(position) {
    if (position >= 0 && position < this.size()) {
      let current = this.head;

      if (position === 0) {
        this.head = current.next;
      } else {
        let index = 0;
        let previous = null;

        while(index < position) {
          previous = current;
          current = current.next;

          index += 1;
        }

        previous.next = current.next;
      }

      this.length -= 1;

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
    let current = this.head;
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
    this.head = null;
  }

  size() {
    return this.length;
  }

  toString() {
    let items = [];
    let current = this.head;

    while (current !== null) {
      items.push(current.item);
      current = current.next;
    }

    return `List: [${items.join(', ')}]`;
  }
}

module.exports = LinkedList;
