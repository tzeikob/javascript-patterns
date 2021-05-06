# The Facade Pattern

The facade pattern belongs to the category of those design patterns called *structural*. Its purpose is to give you the option to use only a simplified fraction of a given large functionality. Let say you only have to use some features of an external library, so regarding your needs you can use this pattern and stick a facade in front of the given exposed.

## Implementation

One of the most famous facades out there is the *JQuery library*, which actually hides all the difficulties and the peculiarities the DOM object brings us. A facade like this simplifies the interface in order to work more easily and only with the features we need and not more than that.

```javascript
// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

// Let say we have a model with an entity
myNS.Entity = function Entity(x, y) {
  this.x = x;
  this.y = y;
};

// We have also a service managing those entities
myNS.service = function service() {
  const methodA = function methodA(entity) {
    return entity.x + entity.y;
  };

  const methodB = function methodB(entity) {
    return entity.x * entity.y;
  };

  return {
    methodA,
    methodB
  };
}();

// Now let say you need only a fraction of the service
myNS.wrapper = function wrapper() {
  const methodC = function methodC(entity) {
    return myNS.service.methodB(entity);
  };

  return {
    methodC
  };
}();

let e = new myNS.Entity(2, 3);

let r = myNS.wrapper.methodC(e); // 6
```

[Go to Source](index.js)

## Use Cases
* [Calculator](calculator.js)

## Considerations

### Pros
* You can use only a fraction of a given large functionality.
* Fast and easy way for the team to adopt the more simplified API.
* Decouple your code from a given external library by using a facade of it.
* You can add more functionality at any time.

### Cons
* Each time you update the library you may update the facade as well.