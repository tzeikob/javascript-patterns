// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.Entity = function Entity(x, y) {
  // Here you can set state to the object
  this.x = x;
  this.y = y;
};

// Here you can share behavior across all objects
myNS.Entity.prototype.methodA = function methodA() {
  return this.x + this.y;
};

myNS.Entity.prototype.methodB = function methodB() {
  return Math.min(this.x, this.y);
};

myNS.Entity.prototype.methodC = function methodC(z) {
  return Math.max(this.x, this.y, z);
};

var e1 = new myNS.Entity(266, 4),
  e2 = new myNS.Entity(3, 145);

var a1 = e1.methodA(),
  b1 = e1.methodB(),
  c1 = e1.methodC(1024);

var a2 = e2.methodA(),
  b2 = e2.methodB(),
  c2 = e2.methodC(-55);

console.log(a1, b1, c1); // 270 4 1024
console.log(a2, b2, c2); // 148 3 145
