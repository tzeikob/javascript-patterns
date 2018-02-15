# The Memo Pattern #

[Back to Home](../../../)

The memo pattern is a technique to improve the performance of your code especially in situations when you need to execute some really heavy calculations which are *repetitive*. Let say you have a recursive function which gives you the *same result* each time you call it given the *same arguments*, in that case is a waste of resources to repeat each calculation you've already done before. The pattern is actually close related with the *memoization* a definition you can find below,

>Memoization is an optimization technique used primarily to speed up computer programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again.

In simple terms memoizing means keep or save something in memory, functions that can memoize can be faster and the reason is that in subsequently calls with previous values there is no need to re execute the function but instead fetch the result cached in its memory. One thing to be mentioned is that this technique is functional only for *pure* functions, a pure function is a function that returns always the same result given the same list of arguments.

## Implementation ##

You can think of the memo pattern as a way to *cache* the results of a function, you know that each time you call it with the same arguments the result would be the same, so why not to cache it for future uses. In order to keep and save the cache of the function you need to create a [closure](../closure/) around it, so you can access it within the function.

```
// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.memo = function memo() {
  // Create a place to cache each calculation
  const cache = {};

  // Create a closure to have access to the cache
  const method = function method(n) {
    // Check if the call is cached before
    if (n in cache) {
      return cache[n];
    }

    let result = n * n;

    // Cache the result for future uses
    cache[n] = result;

    return result;
  };

  return method;
}();

myNS.memo(88); // 7744
myNS.memo(88); // 7744
myNS.memo(88); // 7744
```

[Go to Source](index.js)

## Use Cases ##
* [Fibonacci](fibonacci.js)

## Considerations ##

### Pros ###
* Easy to create using closures.
* Decreases the overhead and the memory usage in recursive methods.
* Avoid exceptions caused by running out of recursive calls in stack.

### Cons ###
* Must be careful of closure binds which tend to increase memory usage.
* Sometimes is hard to create unique keys of the arguments per call.
* It is only applicable for pure functions.

[Back to Home](../../../)
