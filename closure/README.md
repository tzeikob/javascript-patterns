# The Closure Pattern #

[Back to Home](../../../)

The closure is more than a simple design pattern it's a fundamental part of the language itself. You can thing of it like a powerful feature that gives you more options to *control* and *encapsulate* data and functionality in your application. A definition of what a closure is, could be the following,

>A closure is an inner function that has access to the outer (enclosing) function’s variables-scope chain. The closure has three scope chains: it has access to its own scope (variables defined between its curly brackets), it has access to the outer function’s variables, and it has access to the global variables.

Another way to define a closure is to say that a closure is the ability of a function to keep *access* not only to its local variable-scope but to its parents variable-scopes as well, bound with at the very first moment it was declared, even it may be called outside of that place in different part of your code.

## Implementation ##

We know that each time a function is called a new scope is created and bound to it known as its local scope, but actually this only the half truth. There is more to that and that's, each time a function is declared is *capturing* (closing) around the scope of the function it was declared within. We know that functions are objects so each time you declare a new function that object keeps a reference to that scope, creating a closure around it. So each time the function is called still has access to those scopes even when called outside of the its *syntax scope*.

```
let g = 'global';

const outer = function outer() {
  let o = 'outer';

  // At this point inner creates a closure around outer and global scope
  const inner = function inner() {
    let i = 'inner';

    console.log(`I have access to ${i}, ${o} and ${g} scope`);
  };

  return inner;
};

let fn = outer();

fn(); // 'I have access to inner, outer and global scope'
```

[Go to Source](index.js)

## Use Cases ##
* [Counter](counter.js)
* [Stopwatch](stopwatch.js)

## Considerations ##

### Pros ###
* It provides a powerful option to encapsulate data and functionality in private.
* Gives flexibility and more options in favor of code reusability especially in modules.

### Cons ###
* Because a closure binds everything in the outer scope of a function, tends to increase memory usage.
* Sometimes may be hard to grasp on it if you are a beginner.

[Back to Home](../../../)
