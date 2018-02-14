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
