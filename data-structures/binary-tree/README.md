# The Binary Tree #

[Back to Home](../../../../)

A binary tree is a collection of node elements, but unlike arrays or lists the entries are not placed contiguously in memory, instead pointers are used to retain connections. In binary trees each node must have maximum two *child nodes* and no more. A tree node consist of a *key* as the actual value of the node, and the two pointers referencing to its children, the *left*  and the *right* child, that way we build the tree structure. In trees we use the term *root* to denote the top most node entry, which is kind of the same thing like the *head* in linked lists, we need it in order to keep track of the rest tree nodes. One thing to be aware of is, that a key should be stored only once, that's it only one tree node can have a certain key across all the nodes in the tree.

## Implementation ##

In order to implement a binary tree we need a *helper* class to represent the nodes, each node must store the key as a value and two links, one to the left hand-side child and another to point to the right hand-side child. The operations a binary tree should provide are the following ones,

* insert a node given a key value
* remove a node given its key value
* find the minimum key in the tree
* find the maximum key in the tree
* traverse the nodes of the tree in order, pre and post order
* search if a key exists in the tree

```JavaScript
// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.BinaryTree = function() {
  // Use weak map to encapsulate the nodes of each tree instance
  const data = new WeakMap();

  // Use a helper class to represent the tree nodes
  class Node {

    constructor(key) {
      this.key = key;
      this.left = null;
      this.right = null;
    }

    // Dispose references to help garbage collector
    dispose() {
      this.key = null;
      this.left = null;
      this.right = null;
    }
  }

  // Use a private helper recursive function to add a key
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

  // Use a private helper recursive function to remove a node
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

  // Use a private helper recursive function to iterate nodes in order
  const iterateInOrder = function iterateInOrder(subject, callback) {
    if (subject !== null) {
      iterateInOrder(subject.left, callback);
      callback(subject.key);
      iterateInOrder(subject.right, callback);
    }
  }

  // Use a private helper recursive function to iterate node in pre order
  const iteratePreOrder = function iteratePreOrder(subject, callback) {
    if (subject !== null) {
      callback(subject.key);
      iteratePreOrder(subject.left, callback);
      iteratePreOrder(subject.right, callback);
    }
  }

  // Use a private helper recursive function to iterate node in post order
  const iteratePostOrder = function iteratePostOrder(subject, callback) {
    if (subject !== null) {
      iteratePostOrder(subject.left, callback);
      iteratePostOrder(subject.right, callback);
      callback(subject.key);
    }
  }

  // Use a private helper recursive function to find the min key
  const searchMin = function searchMin(subject) {
    if (subject.left !== null) {
      return searchMin(subject.left);
    } else {
      return subject;
    }
  }

  // Use a private helper recursive function to find the max key
  const searchMax = function searchMax(subject) {
    if (subject.right !== null) {
      return searchMax(subject.right);
    } else {
      return subject;
    }
  }

  // Use a private helper recursive function to match a key
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

  class BinaryTree {

    constructor() {
      // Use a custom object to encapsulate the tree data
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

    remove(key) {
      let tree = data.get(this);
      tree.root = drop(tree.root, key);
    }

    traverse(callback, mode = 0) {
      if (mode === -1) {
        iteratePreOrder(data.get(this).root, callback);
      } else if (mode === 1) {
        iteratePostOrder(data.get(this).root, callback);
      } else {
        iterateInOrder(data.get(this).root, callback);
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
  }

  return BinaryTree;
}();

let bt = new myNS.BinaryTree();

bt.insert(5);
bt.insert(2);
bt.insert(22);
bt.insert(3);
bt.insert(1);

// Traverse tree nodes in order
bt.traverse(key => console.log(key), 0); // 1 2 3 5 22

bt.remove(2);

// Traverse tree nodes in pre order
bt.traverse(key => console.log(key), -1); // 5 3 1 22
```

[Go to Source](index.js)

## Use Cases ##
* []()

## Considerations ##

### Pros ###
* Binary trees is one of the best ways to order values.
* Binary trees are a good choice to search for values as well.
* A Key can be any object value that provide a valueOf method returning an ordinal value.

### Cons ###
* Binary trees suffering from the balancing issue, where some parts take more nodes than others.
* To use objects as keys, must provide a valueOf method to return an ordinal representation of the object.

[Back to Home](../../../../)
