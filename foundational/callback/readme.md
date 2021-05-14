# The Callback Pattern

A callback is nothing more than a function, which in JavaScript is considered a **first-class** object. Functions can be assigned to variables, passed as arguments in other functions and even returned by functions. In both the synchronous and asynchronous world of JavaScript this is considered a foundational concept, because either we can pass functionality to be executed at the current cycle (sync) or at a subsequent cycle (async) of the event loop.

## Implementation

As callback is just a function, it can be passed to another function and invoked with the result when the operation in that function completes. It doesn't need to be an asynchronous operation though, callbacks can be used both in **synchronous** and **asynchronous** operations.

### Callback in a synchronous operation

In a synchronous operation, the callback pattern should be implemented like so.

```javascript
function operation (input, callback) {
  // Execute any business logic
  const result = ...

  callback(result); // Call back with the result
};

// Execute the operation given a callback
operation(input, (result) => {
  console.log(result);
});
```

where input can be any valid value or either a list of separated input values followed be the `callback` which always should come last.

### Callback in an asynchronous operation

In an asynchronous operation though, a `callback` should always be called asynchronously in order to be invoked in the next event loop cycles.

```javascript
function operation (input, callback) {
  setTimeout(() => {
    // Execute any business logic
    const result = ...

    callback(result); // Call back with the result
  });
};

operation(input, (result) => {
  console.log(result);
});
```

> We are using the `setTimeout` function in order to mimic the execution of an asynchronous operation.

### Callback which returns a value back

The callback pattern can be used in other use cases as well, for instance in cases where you need to transform the values of a collection. In such cases a callback is given a value and returns it back modified instead of just handle it.

```javascript
function operation (values, callback) {
  const results = [];

  for (let i = 0; i < values.length; i++) {
    // Execute the callback for each value
    const result = callback(values[i]);

    results.push(result); // Collect the next result
  }

  return results;
}

const values = [1, 2, 3, 4, 5];

// Execute the operation
const results = operation(values, (value) => {
  return value * 2;
});
```

### Error handling in a callback

Another important thing is to be consistent with error handling in callbacks, in case an `error` is thrown the `callback` has always to be called given that error as the first and only argument.

```javascript
function operation (input, callback) {
  setTimeout(() => {
    try {
      // Execute business logic
      const result = ...
      
      callback(null, result); // Calling back with the result
    } catch (error) {
      callback(error); // Propagating an error back
    }
  });
}

// Execute the operation
operation(input, (error, result) => {
  // Error must always come first
  if (error) {
    return console.error(error);
  }

  console.log(result);
});
```

To sum up, a callback called synchronously blocks the current code until the operation completes, where an asynchronously called callback returns control back immediately and completes at a subsequent event loop cycle. As mentioned above, there is no syntactic difference which means that the intent of the callback should always be explained in the documentation of the API about the synchronous or asynchronous manner the callback is called.

## Considerations

### Unpredictable synchronous or asynchronous behavior

Try to avoid inconsistencies in the behavior of a function which is using a callback, either the callback should always be called synchronously or asynchronously. It is considered very bad practice to have a function behave unpredictably mixing synchronous and asynchronous calls to the given callback. Let's say we have a `cache` map object and an asynchronous `factorial` function:

```javascript
import { factorial } from "math";

function compute (num, callback) {
  if (cache[num]) {
    return callback(cache[num]); // Call back synchronously
  }

  // Calling the asynchronous factorial
  factorial(num, (result) => {
    cache[num] = result; // Save calculation into the cache

    callback(result); // Call back asynchronously once
  });
}
```

> We are skipping the error handling here just for simplicity and readability.

Once you first compute the `factorial` of a number the next time you request the same number's factorial, the call to the callback will be synchronous. Instead try to stick with either synchronous or asynchronous behavior in any function expecting a callback.

```javascript
function compute (num, callback) {
  if (cache[num]) {
    // Call always back asynchronously
    return setTimeout(() => callback(cache[num]));
  }
  
  factorial(num, (result) => {
    cache[num] = result; // Save calculation into the cache

    callback(result); // Call back asynchronously
  });
}
```

## Use Cases

Below you can find various trivial or real-world implementations of this pattern:

* [Factorial](factorial.js): Calculate the factorial of a given non-negative integer number
* [Mapper](mapper.js): A trivial implementation of the `Array.prototype.map` method