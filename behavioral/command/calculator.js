var myNS = myNS || Object.create(null);

myNS.Calculator = function Calculator() {
  this.result = 0;
  this.commands = [];
};

myNS.Calculator.prototype.add = function add(value) {
  this.result += value;
  return this.result;
};

myNS.Calculator.prototype.execute = function execute(name, ...args) {
  if (this[name]) {
    this.commands.push({
      name,
      args
    });

    return this[name].apply(this, args);
  }

  return false;
};

myNS.Calculator.prototype.replay = function replay() {
  this.result = 0;

  this.commands.forEach(c => {
    this[c.name].apply(this, c.args);
  });
};

let c = new myNS.Calculator();

c.execute('add', 22);
c.execute('add', -3);

console.log(c.result); // 19

c.result = 666;
c.replay();

console.log(c.result); // 19
