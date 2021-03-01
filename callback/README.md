# The Callback Pattern #

A **callback** is nothing more than a function, which in JavaScript is considered a **first-class** object. Functions can be assigned to variables, passed as arguments in other functions and even returned by functions. In both the synchronous and asynchronous world of JavaScript this is considered a foundational concept, because either we can pass functionality to be executed at the same cycle of the event loop or at a future event loop cycle without blocking the current code.

## Explanation ##

As callback is just a function, it can be passed to another function and invoked with the result when the operation in that function completes. It doesn't need to be an asynchronous operation though, callbacks can be used both in synchronous and asynchronous operations.

### Callback in a synchronous operation ###

In a synchronous operation, a callback should be implemented like so:

```javascript
function concat (a, b, callback) {
  // Complete the operation
  const result = `${a} ${b}`;

  // Call back with the result
  callback(result);
};

concat("Hello", "World", function callback (result) {
  console.log(result);
});
```

### Callback in an asynchronous operation ###

In an asynchronous operation though, a callback should be used like so:

```javascript
function concat (a, b, callback) {
  setTimeout(() => {
    // Complete the operation
    const result = `${a} ${b}`;

    // Call back with the result
    callback(result);
  });
};

concat("Hello", "World", function callback (result) {
  console.log(result);
});
```

> Note: we are using the `setTimeout` function in order to mimic the execution of an asynchronous operation in a future event loop cycle.

### Callback which returns a value back ###

The callback pattern can be used in other use cases as well, for instance in cases where you need to transform the values of a collection. In such cases a callback is given a value and returns it back modified instead of just handle it.

```javascript
function map (values, callback) {
  const mapped = [];

  for (let i = 0; i < values.length; i++) {
    // Call with the value and return it back
    const value = callback(values[i]);

    mapped.push(value);
  }

  return mapped;
}

const values = [1, 2, 3, 4, 5];

const mapped = map(values, function callback (value) {
  return value * 2;
});
```

### Error handling in a callback ###

Always have the callback argument as the last argument in the function, this way your code will be more readable and consistent with the rest of the community. Another important thing is to be consistent with error handling in callbacks and have any error comes first when propagating errors back like so:

```javascript
function compute (num, callback) {
  setTimeout(() => {
    try {
      const result = num * 2;
      
      callback(null, result); // Calling back with the result
    } catch (error) {
      callback(error); // Propagating an error back
    }
  });
}

compute(2, function callback (error, result) {
  // Error comes first
  if (error) {
    return console.error(error);
  }

  console.log(result);
});
```

To sum up, a callback called synchronously blocks the current code until the operation completes, where an asynchronously called callback returns control back immediately and completes, given the result, at a later event loop cycle. In any use case mentioned above, there is no syntactic difference which means that the intent of the callback should always be explained in the documentation of the API.

## Implementations ##

Below you can find various trivial or real-world implementations of this pattern:

* [factorial](factorial.js): calculate the factorial of a given non-negative integer number.
* [mapper](mapper.js): a trivial implementation of the `Array.prototype.map` method.

## Considerations ##

### Unpredictable synchronous or asynchronous behavior ###

Try to avoid inconsistencies in the behavior of a function which is using a callback, either the callback should always be called synchronously or asynchronously. It is considered very bad practice to have a function behave unpredictably mixing synchronous and asynchronous calls to the given callback. Let's say we have a `cache` map object and an async `factorial` function:

```javascript
function compute (num, callback) {
  if (cache[num]) {
    return callback(cache[num]); // Call back synchronously
  }


  factorial(num, (result) => {
    cache[num] = result; // Next time call back synchronously

    callback(result); // Call back asynchronously once
  });
}
```

> Note: we are skipping the error handling for simplicity and readability.

Once you first compute the factorial of a number the next time you request the same number's factorial, the call to the callback will be synchronous. Instead try to stick with either synchronous or asynchronous behavior in any function expecting a callback.

```javascript
function compute (num, callback) {
  if (cache[num]) {
    return setTimeout(() => callback(cache[num])); // Call always back asynchronously
  }
  
  factorial(num, (result) => {
    cache[num] = result;

    callback(result); // Call back asynchronously
  });
}
```