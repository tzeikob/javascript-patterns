// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.Entity = function Entity(x, y) {
  this.x = x;
  this.y = y;
};

myNS.Entity.prototype.methodA = function methodA() {
  return this.x + this.y;
};

// Extend existing functionality without breaking it
myNS.BetaEntity = function BetaEntity(x, y, z) {
  myNS.Entity.call(this, x, y);

  // Decorate it with more features
  this.z = z;
};

// Link prototypes to borrow methods as well
myNS.BetaEntity.prototype = Object.create(myNS.Entity.prototype);

// Extend existing method without breaking it
myNS.BetaEntity.prototype.methodA = function methodA() {
  // Call shadowed method to borrow functionality
  let value = myNS.Entity.prototype.methodA.call(this);

  return value + this.z;
};

let e1 = new myNS.Entity(1, 2);
let e2 = new myNS.BetaEntity(1, 2, 3);

let a1 = e1.methodA();
let a2 = e2.methodA();

console.log(a1); // 3
console.log(a2); // 6
