var myNS = myNS || Object.create(null);

myNS.BinaryTree = function() {
  const data = new WeakMap();

  class Node {
    constructor(key) {
      this.key = key;
      this.left = null;
      this.right = null;
    }

    dispose() {
      this.key = null;
      this.left = null;
      this.right = null;
    }
  }

  const add = function add(subject, node) {
    if (node.key < subject.key) {
      if (subject.left === null) {
        subject.left = node;
      } else {
        add(subject.left, node);
      }
    } else {
      if (subject.right === null) {
        subject.right = node;
      } else {
        add(subject.right, node);
      }
    }
  }

  const searchMin = function searchMin(subject) {
    if (subject.left !== null) {
      return searchMin(subject.left);
    } else {
      return subject;
    }
  }

  const searchMax = function searchMax(subject) {
    if (subject.right !== null) {
      return searchMax(subject.right);
    } else {
      return subject;
    }
  }

  const match = function match(subject, key) {
    if (subject === null) {
      return false;
    } else if (key < subject.key) {
      return match(subject.left, key);
    } else if (key > subject.key) {
      return match(subject.right, key);
    } else {
      return true;
    }
  }

  const drop = function drop(subject, key) {
    if (subject === null) {
      return null;
    }

    if (key < subject.key) {
      subject.left = drop(subject.left, key);
      return subject;
    } else if (key > subject.key) {
      subject.right = drop(subject.right, key);
      return subject;
    } else {
      if (subject.left === null && subject.right === null) {
        subject.dispose();
        subject = null;
        return subject;
      }

      if (subject.left === null) {
        subject = subject.right;
        return subject;
      } else if (subject.right === null) {
        subject = subject.left;
        return subject;
      } else {
        let minimum = searchMin(subject.right);

        subject.key = minimum.key;
        subject.right = drop(subject.right, minimum.key);
        return subject;
      }
    }
  }

  const iterate = function iterate(subject, callback) {
    if (subject !== null) {
      iterate(subject.left, callback);
      callback(subject.key);
      iterate(subject.right, callback);
    }
  }

  class BinaryTree {
    constructor() {
      data.set(this, {
        root: null
      });
    }

    insert(key) {
      let node = new Node(key);
      let tree = data.get(this);

      if (tree.root === null) {
        tree.root = node;
      } else {
        add(tree.root, node);
      }
    }

    min() {
      let tree = data.get(this);

      if (tree.root != null) {
        return searchMin(tree.root).key;
      }

      return undefined;
    }

    max() {
      let tree = data.get(this);

      if (tree.root != null) {
        return searchMax(tree.root).key;
      }

      return undefined;
    }

    has(key) {
      return match(data.get(this).root, key);
    }

    remove(key) {
      let tree = data.get(this);
      tree.root = drop(tree.root, key);
    }

    traverse(callback) {
      iterate(data.get(this).root, callback);
    }
  }

  return BinaryTree;
}();

let bt = new myNS.BinaryTree();

bt.insert(5);
bt.insert(2);
bt.insert(22);
bt.insert(3);
bt.insert(1);

bt.traverse(key => console.log(key)); // 1 2 3 5 22

bt.remove(2);

bt.traverse(key => console.log(key)); // 1 3 5 22

bt.min(); // 1
bt.max(); // 22
bt.has(22); // true
