# The Factory Pattern #

[Back to Home](../../../../)

The factory pattern belongs to the category of those design patterns called *creational*. It encapsulates and organizes reusable modules or functionality, in a way they are cached and exposed publicly into a vocabulary of terms, so you can ask for them and get them on demand.

## Implementation ##

You can thing of this pattern also as a *factory* of different kind of objects aka *domain*, where you can use it like an isolated module which actually exposes to you all the objects of your model around a single name space. Nothing prevents you from creating multiple instances of a factory, but each one of that instances will have its own internal state, so it's smart to use that pattern as a *singleton* object.

```JavaScript
// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.factory = function factory() {
  // Create some reusable constructors to expose
  const Alpha = function Alpha(value) {
    this.value = value;
  };

  Alpha.prototype.log = function log() {
    console.log(`A{ value: ${this.value} }`);
  };

  const Beta = function Beta(value) {
    this.value = value;
  };

  Beta.prototype.log = function log() {
    console.log(`B{ value: ${this.value} }`);
  };

  // Index constructors into a dictionary
  const dict = [{
      name: 'alpha',
      source: Alpha
    },
    {
      name: 'beta',
      source: Beta
    }
  ];

  // Cache dictionary items into a public vocabulary
  const vocab = {};

  dict.forEach(item => {
    vocab[item.name] = item.source;
  });

  // Here you can reveal the vacabulary
  return vocab;
}();

let a = new myNS.factory.alpha(5);
let b = new myNS.factory.beta(9);

a.log(); // A{ value: 5 }
b.log(); // B{ value: 9 }
```

[Go to Source](index.js)

## Use Cases ##
* [Domain](domain.js)

## Considerations ##

### Pros ###
* You can modularize your code into reusable objects.
* You keep your global scope clean of variables and functions.
* Cleaner way to expose and reveal your domain model.

### Cons ###
* Each module instance will create its own copies of functions in memory.
* You need to cache each term especially when loading external resources like modules.

[Back to Home](../../../../)
