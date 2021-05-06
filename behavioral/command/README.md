# The Command Pattern

The command pattern belongs to the category of those design patterns called *behavioral*. The command patterns gives you the ability to encapsulate a *calling method* as an object, so it allows you to fully decouple the execution from the implementation.

## Implementation

The command design pattern allows you to get less fragile implementations by building functionality on an existing implementation like a repository service. An important thing is that with this patterns you're able to keep track on each command executed which gives you the ability to undo or rollback into previous state.

```javascript
// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

// Let say we have an entity which collecting items
myNS.Entity = function Entity() {
  this.items = {};
  this.commands = [];
};

myNS.Entity.prototype.get = function get(key) {
  return this.items[key];
};

myNS.Entity.prototype.add = function add(item) {
  this.items[item.key] = item;
  return item;
};

// Add method to call a command given its method name
myNS.Entity.prototype.execute = function execute(name, ...args) {
  if (this[name]) {
    // Register the command so to be able to rollback
    this.commands.push({
      name,
      args
    });

    return this[name].apply(this, args);
  }

  return false;
};

// Add a replay method to execute all the commands as a rollback
myNS.Entity.prototype.replay = function replay() {
  this.commands.forEach(c => {
    this[c.name].apply(this, c.args);
  });
};

let e = new myNS.Entity();

e.execute('add', {
  key: 1,
  value: 333
});

e.execute('add', {
  key: 2,
  value: 445
});

// Let say something catastrophic happend
e.items = {};

// You can replay to rollback the state
e.replay();
```

[Go to Source](index.js)

## Use Cases
* [Calculator](calculator.js)

## Considerations

### Pros
* Decouple the execution from the implementation.
* Get less fragile implementations.
* You're able to rollback and undo operations.
* Easy to add logging and auditing operations.

### Cons
* Storing commands history into memory could be a possible overhead.
* Rollback operations could be very tricky to implement.