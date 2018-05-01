# The Decorator Pattern #

[Back to Home](../../../../)

The decorator pattern belongs to the category of those design patterns called *structural*. Its purpose is to give you the option to extend any functionality you may have by wrapping features around existing objects, protecting them from being broken.

## Implementation ##

You can thing of this pattern also as an inheritance pattern using the built-in [prototype](../../creational/prototype) feature, imagine you have a task object that pretty much encapsulates the state and the behavior of a regular assignment job but at some point you may need to add more features and functionality to it. In order to do that without breaking the existing code you have to extend it using prototypes.

```JavaScript
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
```

[Go to Source](index.js)

## Use Cases ##
* [Calculator](calculator.js)

## Considerations ##

### Pros ###
* You can add functionality to an object without being obtrusive.
* You can protect existing objects by wrapping functionality.
* Complete inheritance that allows you to extend functionality.

### Cons ###
* Because of shadowing it's easy to overwrite existing methods.
* You have to be familiar with prototype chains.

[Back to Home](../../../../)
