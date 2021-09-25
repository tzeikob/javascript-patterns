# The Callback Pattern

A callback is nothing more than a function, which in JavaScript is considered a **first-class** object. Functions can be assigned to variables, passed as arguments in other functions and even returned by functions. In both the synchronous and asynchronous world of JavaScript this is considered a foundational concept, because either we can pass functionality to be executed at the current cycle (synchronously) or at a subsequent cycle (asynchronously) of the event loop.

## Implementation

As callback is just a function, it can be passed to another function and invoked with the result when the operation in that function completes. It doesn't need to be an asynchronous operation though, callbacks can be used both in **synchronous** and **asynchronous** operations.

### Callback in a synchronous operation

In a synchronous `operation` given an `input` and a `callback` function, the first thing is to start executing the business logic and once we have the `result` we invoke the `callback` given that value.

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

Even though an input is required for the most operations out there, it is not required to have one. In fact we can have as many input arguments as we need or none if the operation doesn't need such an input. One thing to keep in mind though is that by convention in case of having input arguments, the `callback` argument should always come last.

### Callback in an asynchronous operation

In an asynchronous operation though, a `callback` should always be called asynchronously in order to be invoked in subsequent event loop cycles. Both the business logic and the call to the callback must happen in a subsequent cycle, otherwise we are blocking the event loop.

```javascript
function operation (input, callback) {
  setTimeout(() => {
    // Execute any business logic
    const result = ...

    callback(result); // Call back with the result
  });
};

// Execute the operation
operation(input, (result) => {
  console.log(result);
});
```

> We are using the `setTimeout` function in order to mimic the execution of an asynchronous operation.

### Callback which returns a value back

The callback pattern can be used in other use cases as well, for instance in cases where you need to transform the `values` of a collection synchronously. In those cases a `callback` should be a function expecting a `value` as input which should be returned back modified or as a new one. The callback should be called for each one value in the given collection, where every `result` should be collected into a new collection of `results`.

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

One important thing with callbacks is to be consistent with error handling, that's it we should take care of any thrown errors either in synchronous or asynchronous operations. In case an `error` is thrown the `callback` has always to be immediately called back given that error as the **first** and only argument. In synchronous operations the error handling could be done like so.

```javascript
function operation (input, callback) {
  try {
    // Execute business logic
    const result = ...
    
    callback(null, result); // Calling back with the result
  } catch (error) {
    callback(error); // Propagating an error back
  }
}
```

Where in asynchronous operations any `try/catch` should be happening in the asynchronous context, otherwise the thrown error will be swallowed as we are not in the same call stack anymore.

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
```

And here is how we execute the operation handling thrown errors in the callback.

```javascript
// Execute the operation
operation(input, (error, result) => {
  // Error must always come first
  if (error) {
    return console.error(error);
  }

  console.log(result);
});
```

> Note the use of the `return` in order to abort early the callback function. We don't want to keep executing code meant to be only for handling results.

To sum up, a callback called synchronously blocks the current code until the operation completes, where an asynchronously called callback returns control back immediately and completes at a subsequent event loop cycle. As it is clear there is no syntactic difference between synchronous and asynchronous operations via callback, the intent of the callback should always be explained in the documentation of the API.

## Considerations

### Avoid swallowing thrown errors in asynchronous operations

A very common mistake when handling errors in asynchronous operations is following the same practice as with synchronous operations. Let's say we have the following asynchronous operation, our first thought could be to have the `try/catch` wraps around the `setTimeout` call.

```javascript
function operation (input, callback) {
  try {
    setTimeout(() => {
      // Any error thrown here will be swallowed
      const result = ...

      callback(null, result);
    });
  } catch (error) {
    callback(error); // Oops, this will never be called
  }
}
```

> As we took of in another call stack, no error will be caught here.

So the right way to handle thrown errors from an asynchronous code is to move the `try/catch` within the same call stack like so.

```javascript
function operation (input, callback) {
  setTimeout(() => {
    try {
      const result = ...

      callback(null, result);
    } catch (error) {
      callback(error); // This will be called if an error is thrown
    }
  });
}
```

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
import { factorial } from "math";

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