function Entity(x, y) {
  this.x = x;
  this.y = y;
};

Entity.prototype.methodA = function() {
  return this.x + this.y;
};

Entity.prototype.methodB = function() {
  return Math.min(this.x, this.y);
};

Entity.prototype.methodC = function(z) {
  return Math.max(this.x, this.y, z);
};

let e1 = new Entity(266, 4),
  e2 = new Entity(3, 145);

let a1 = e1.methodA(),
  b1 = e1.methodB(),
  c1 = e1.methodC(1024);

let a2 = e2.methodA(),
  b2 = e2.methodB(),
  c2 = e2.methodC(-55);

console.log(a1, b1, c1); // 270 4 1024
console.log(a2, b2, c2); // 148 3 145
