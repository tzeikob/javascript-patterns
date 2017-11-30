# The Module Pattern #

[Back to the ToC](../../../)

The revealing module pattern belongs to the category of those design patterns called *creational*. That pattern is very similar to the [module pattern](../../../module/) that gives you the option to organize and structure your code into reusable containers having state and behavior, in a way they containerize private state in terms of encapsulation and exposing *public API* methods, but the revealing module pattern does this in a way that gives more cleaner and readable code, that would be the best practice in large modules where maintenance is a priority.

## Usage ##

You can thing of this pattern in a more abstract way as a *factory* of objects, where you can use it like an isolated module which actually closing around a specific lexical scope, in order to encapsulate an internal state. That internal state is actually what the exposed public API has access to and will use later on. Be aware that each module will create its own internal state and that state is actually shared only to its public API. For instance, you can use it when you have a requirement to reuse functionality many times across your code base and you want that to be done in a way to isolate and encapsulate its internal state to increase both code structure and integrity. Nothing prevents you from creating multiple instances of that module, but each one of that instances will have its own internal state, so it's smart to use that pattern as a *singleton* object.

## Example ##

```
// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.module = function module() {
  // Here you can define the private internal state
  var x = 16;
  var y = 23;

  function methodD() {
    return Math.min(x, y);
  }

  function methodA() {
    return x;
  }

  function methodB() {
    return y;
  }

  function methodC() {
    var val = methodD();
    return Math.sqrt(val);
  }

  // Here you can reveal the public API
  return {
    methodA,
    methodB,
    methodC
  };
}();

var sqrt = myNS.module.methodC();
console.log(sqrt); // 4
```

[Go to the Source](index.js)

## What to consider before use ##

### Pros ###
* You can modularize your code into reusable objects
* You keep your global scope clean of variables and functions
* Expose only public API while hiding private internal state
* Cleaner way to expose and reveal only the public members

### Cons ###
* It's not easy to extend functionality
* Each module instance will create its own copies of functions in memory
* May be difficult to debug or test internal functionality other than the public API

[Back to the ToC](../../../)
