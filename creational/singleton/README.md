# The Singleton Pattern #

[Back to Home](../../../../)

The singleton pattern belongs to the category of those design patterns called *creational*. Its purpose is to give you the option to use any functionality, encapsulated in a module, into your code just by creating a single instance of it. That's it instead of using factories, singletons are the best option to make sure your application is using the same instance of a module and not create a new one each time you requesting it.

## Implementation ##

You can thing of this pattern also as a *factory* but that factory would only create one instance of the module and expose it to your application context once, so you end up actually using the same singleton object no matter who many times you requesting the module ahead of time and in different places of your application. The only thing you should do is to expose a public *get instance* method which is responsible to create the singleton at the very first time and then return that one object each time you call it in the future.

```JavaScript
// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.module = function module() {
  // Let's create a dummy constructor
  const Alpha = function Alpha() {
    this.value = Math.random();
  };

  Alpha.prototype.log = function log() {
    console.log(`A{ value: ${this.value} }`);
  };

  // Initiate instance to be undefined
  let instance;

  return {
    getInstance: function getInstance() {
      if (!instance) {
        // Create the instance once only
        instance = new Alpha();
      }

      return instance;
    }
  };
}();

// Here you get the same instance
let a1 = myNS.module.getInstance();
let a2 = myNS.module.getInstance();

if (a1 === a2) {
  console.log('We are equal!'); // We are equal!
}
```

[Go to Source](index.js)

## Use Cases ##
* [Repository](repository.js)

## Considerations ##

### Pros ###
* You can modularize your code into reusable objects.
* You keep your global scope clean of variables and functions.
* Inject modules in various places in your application context once only.

### Cons ###
* You need to be careful especially working with external resources like db connections etc.

[Back to Home](../../../../)
