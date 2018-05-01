# The Class Pattern #

[Back to Home](../../../../)

The class pattern belongs to the category of those design patterns called *creational* and is based on the built-in *class* feature of the language added in ECMAScript 2015. That pattern gives you the option to organize and structure your code into reusable containers having state and behavior, in an almost similar way classes are for the *classical object-oriented* languages.

## Implementation ##

The class is actually nothing more than a *syntactic sugar* upon the [prototype](../prototype) pattern, which can be used in combination with the *this* mechanism in order to base an object on a shared functionality across other objects created by the same *constructor* function. On a top of that you can have member methods as well as static ones and extend base classes into a more concrete and less generic ones creating a short of inheritance in favor of reusability.

```JavaScript
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
```

[Go to Source](index.js)

## Use Cases ##
* [Calculator](calculator.js)

## Considerations ##

### Pros ###
* Use the language features to leverage functionality.
* Organize you code into re-usable objects.
* You can extend existing functionality by the extend keyword.
* You can keep your global scope clean of variables and functions.
* No duplicate functions/methods are added for each object, so you get better memory usage.
* You can override/shadow methods.

### Cons ###
* The *this* mechanism is somewhat tricky to understand at the first place.
* Is just a syntactic sugar upon prototype pattern nothing more than that.

[Back to Home](../../../../)
