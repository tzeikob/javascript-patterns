// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.Entity = class Entity {
  constructor(x, y) {
    // Here you can set state to the object
    this.x = x;
    this.y = y;
  }

  // Add member methods shared across objects
  methodA() {
    return this.x + this.y;
  }

  methodB() {
    return Math.min(this.x, this.y);
  }

  methodC(z) {
    return Math.max(this.x, this.y, z);
  }

  // Add static methods as well
  static clone(other) {
    return new Entity(other.x, other.y);
  }
};

let e1 = new myNS.Entity(266, 4),
  e2 = new myNS.Entity(3, 145);

let a1 = e1.methodA(),
  b1 = e1.methodB(),
  c1 = e1.methodC(1024);

let a2 = e2.methodA(),
  b2 = e2.methodB(),
  c2 = e2.methodC(-55);

console.log(a1, b1, c1); // 270 4 1024
console.log(a2, b2, c2); // 148 3 145

let clone = myNS.Entity.clone(e1);

console.log(clone); // Entity { x: 266, y: 4 }
