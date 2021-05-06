# The Binary Tree

A binary tree is a collection of node entries, but unlike arrays or lists the entries are not placed contiguously in memory, instead pointers are used to retain connections and the overall structure. In binary trees each node must have maximum two *descendant nodes* which is also known as *children*. A tree node consist of a *key* as the actual value of the node entry, and the two pointers referencing to its children, the *left*  and the *right*, that way we build the tree structure. We use the term *root* to denote the top most node entry, which is kind of the same thing like the *head* in linked lists, we need it in order to keep track of the rest nodes in the tree. One thing to be aware of is, that a key should be stored only once, that's it, only one tree node can have a certain key across all the nodes in that tree.

## Implementation

The first thing to do is to prepare the code to protect the *internal state* of each binary tree instance, so it is not publicly exposed in other parts of the code. We are gonna use a *WeakMap* container to *cache* the internal state of each binary tree using the instance reference itself as the key.

```javascript
const data = new WeakMap();
```

### The node helper class

In order to implement a binary tree we need a *helper* class to represent the nodes, as we already mentioned each node must keep the key as a value and two pointers, one to the left hand-side child and another to the right hand-side child. The very first time a node is created only the *key* property is initialized both the *left* and *right* pointers are left null. The key value can be any ordinal value like a primitive value or a custom object as long as a *valueOf* method is provided returning the actual ordinal number that object is represented of. One important thing is that we provide a method to *dispose* the internal state of a node by unlinking all the external pointers and references in order to help garbage collector in cases like node removals.

```javascript
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
```

### The tree operations

Before we start implementing the binary tree class we need some private helper functions to support all the operations a binary tree should provide, which are the following ones,

* insert a node given a key value
* find the minimum key in the tree
* find the maximum key in the tree
* search if a key exists in the tree
* remove a node given its key value
* traverse the tree nodes in order

the most of these functions are using *recursion* in order to simplify the code complexity and split the problem into smallest parts.

#### Insert a node given a key value

A binary tree stores its entries in an ordinal way so that the key of any node in the tree, must be *greater than* any key of its left hand-side descendants and *less than* any key of its right hand-side descendants. We use recursive calls to redefine the subject node, under which we should add the new node, in case the candidate position (left or right child) of the subject node is occupied by another node and is not available.

```javascript
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
```

#### Find the minimum key in the tree

In order to find the node entry with the minimum key across all the nodes in the tree, we need to traverse all the left hand-side descendants until we visit the left most node entry in the tree.

```javascript
const searchMin = function searchMin(subject) {
  if (subject.left !== null) {
    return searchMin(subject.left);
  } else {
    return subject;
  }
}
```

#### Find the maximum key in the tree

In order to find the node entry with the maximum key across all the nodes in the tree, we need to traverse all the right hand-side descendants until we visit the right most node entry in the tree.

```javascript
const searchMax = function searchMax(subject) {
  if (subject.right !== null) {
    return searchMax(subject.right);
  } else {
    return subject;
  }
}
```

#### Search if a key exists in the tree

Given a key value we can traverse the tree nodes downward the same way we do in addition until we actually visit a node that has the actually key in question.

```javascript
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
```

#### Remove a node given its key value

The removal of a tree node in a more complex operation than the others, the first thing to do is to find the node which is actually the subject for the removal. Having the tree node that must be dropped, we need take some side-effect actions in order to retain the structure of the tree after the removal. We should take a different approach depending on the state of the node to be dropped and its descendants. If the node is a *leaf node* (both the left and right descendants are null) we only need to dispose the node and return null.

If the node has only one of its descendants equal to null, then we only need to replace this node reference with the descendant reference that it's not null. The more complex case is where both the descendants are not equal to null, in which case we shall find the minimum right hand-side node of the subject node and use that value to update the subject key value. Then we should drop that minimum node found before and use its parent as the right descendant of the subject node.

```javascript
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
```

#### Traverse the tree nodes in order

In order to traverse the tree nodes in their ordinal order and do a given callback on it, we should first visit recursively the left hand-side tree nodes of the subject then apply the callback to the subject itself and finally visit recursively the right hand-side nodes of the subject.

```javascript
const iterate = function iterate(subject, callback) {
  if (subject !== null) {
    iterate(subject.left, callback);
    callback(subject.key);
    iterate(subject.right, callback);
  }
}
```

### The binary tree class

In order to keep track on the internal state of a binary tree, we only need to store a reference to the *root* node of the tree. The exposed methods for insert, remove of nodes along with the others like min, max and traverse are using the recursive operations mentioned above.

```javascript
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
```

Now we can put all together and see the binary tree in action with some real data.

```javascript
let bt = new BinaryTree();

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
```

[Go to Source](index.js)

## Considerations

### Pros
* Binary trees is one of the best ways to order values.
* Binary trees are a good choice to search for values as well.
* A Key can be any object value that provide a valueOf method returning an ordinal value.

### Cons
* Binary trees suffering from the balancing issue, where some parts take more nodes than others.
* To use objects as keys, must provide a valueOf method to return an ordinal representation of the object.