# The Prototype Pattern #

[Back to Home](../../../../)

The prototype pattern belongs to the category of those design patterns called *creational* and is based on the built-in *prototype* feature of the language. That pattern gives you the option to organize and structure your code into reusable containers having state and behavior, in an almost similar way classes are for the *classical object-oriented* languages.

## Implementation ##

The prototype is a *built-in* ready to use feature of the JavaScript language, which can be used in combination with the *this* mechanism in order to base an object on a shared functionality across other objects created by the same *constructor* function. The main idea behind the prototype is that each object created, is automatically linked to the prototype object of the constructor function created by. So by extending that prototype object you can share functionality across all objects. You can thing this more like a *delegation* model, where each object has its own state and when gets a request for something it doesn't have it delegates that request to the prototype object.

```JavaScript
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
```

[Go to Source](index.js)

## Use Cases ##
* [Calculator](calculator.js)

## Considerations ##

### Pros ###
* Use the language features to leverage functionality.
* Organize you code into re-usable objects.
* You can extend existing functionality through prototypes.
* You can keep your global scope clean of variables and functions.
* No duplicate functions/methods are added for each object, so you get better memory usage.
* You can override/shadow methods using prototypes.

### Cons ###
* The *this* mechanism is somewhat tricky to understand at the first place.
* The prototype definition is separated from the constructor definition.

[Back to Home](../../../../)
