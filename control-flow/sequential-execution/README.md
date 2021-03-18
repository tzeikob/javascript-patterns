# The Sequential Execution Pattern #

The **sequential execution** pattern belongs to the category of those design patterns called **async control flow** patterns. This pattern allows you to control the **execution** of asynchronous tasks in a **sequential order**, which means that every task should be executed as part of a **chain** or **pipeline** of tasks.

## Explanation ##

The sequential execution pattern can be implemented using either old school **callbacks** or the more development friendly **promises**, where either implementation should give us the same execution.

### Sequential execution with callbacks ###

Let's start by making the assumption that a sequential execution of tasks should be started given two arguments, an **input** of any type and the **completion callback**. Each task in execution is responsible to invoke the next in order task passing both the completion callback along with any result computed so far. In the case of an error is thrown at any given time, the execution should be canceled immediately by invoking the completion callback with the error. One critical rule is that the completion callback should be called only once and either with an error only or the result.

In order to keep our code as clean as possible we can split the execution of each task in a separate function instead of hard coding invocations within the lexical scope of a single function. Now assume we have a generic asynchronous function called `operation` which just expects two arguments, an `input` and a `callback`, the following code is an implementation of a sequential execution of three tasks using this asynchronous operation.

```javascript
// An asynchronous operation
function operation (input, callback) {...}

function execution (input, callback) {
  // Call the first task for execution
  task1(input, callback);
}

function task1 (input, callback) {
  // Execute asynchronous operation
  operation(input, (error, result) => {
    if (error) {
      return callback(error); // Call back early with error
    }

    // Call next task passing the result as input
    task2(result, callback);
  });
}

function task2 (input, callback) {
  // Execute asynchronous operation
  operation(input, (error, result) => {
    if (error) {
      return callback(error); // Call back early with error
    }

    // Call next task passing the result as input
    task3(result, callback);
  });
}

function task3 (input, callback) {
  // Execute asynchronous operation
  operation(input, (error, result) => {
    if (error) {
      return callback(error); // Call back early with error
    }

    // Call back with the result of completion
    callback(null, result);
  });
}

// Launch the execution of tasks
execution(input, (error, result) => {
  if (error) {
    return console.error(error);
  }

  console.log(result);
});
```

> Splitting each task in a separate named function will give us a cleaner and well structured code.

Bear in mind that we are using an input argument in the call of a task, this way we can share previous computed data to tasks down into the chain of execution without polluting the top scope via closures. The convention here is that the output of a task should be considered the input of the next in the line task, that input/output could be any type of value including custom objects.

### Sequential execution with promises ###

A more elegant approach to implement this pattern is to use promises which will give us more readable and less error-prone code in comparison to callbacks. Apart from readability one drawback in callbacks implementation is that's so easy to call the completion callback twice or even more times by accident, which will introduce serious problems in any application. In promises this is not the case because every promise is guaranteed to be resolved only **once** either fulfilled or rejected. So let's say we have the same operation function and tasks as before but this time instead of using async callback the operation returns a promise,

```javascript
// An operation returns as a promise
function operation (input) {
  return new Promise((resolve, reject) => {...});
};

const task1 = (input) => operation(input);
const task2 = (input) => operation(input);
const task3 = (input) => operation(input);
```

the code to implement the sequential execution of those three asynchronous tasks is now just a matter of a few lines of code.

```javascript
// Launch the execution
task1(input)
  .then((result) => task2(result))
  .then((result) => task3(result))
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
```

By chaining each promise returned from a task we are making sure that the execution is running in a strictly sequential order. Any rejected promise during the execution will be caught by the error handler defined in the `catch` method, something that is making our code more maintainable and reliable against bugs introduced during development.

## Considerations ##

### Avoid the callback hell anti-pattern ###

By using in-place anonymous function definitions where we have to place a callback is considered a very bad practice when you have a list of tasks must be executed one after the other. The reason is that this will eventually result in the chaos of an unreadable code (pyramid of doom), hard to maintain, debug and test. So avoid doing the following when you have to control the execution of asynchronous tasks.

```javascript
function execution (input, callback) {
  operation(input, (error, result) => {
    if (error) {
      return callback(error);
    }

    operation(result, (error, result) => {
      if (error) {
        return callback(error);
      }

      operation(result, (error, result) => {
        if (error) {
          return callback(error);
        }

        callback(null, result);
      });
    });
  });
});

execution(input, (error, result) => {
  ...
});
```

Instead try to split your code into named function definitions per task, this way you can test and debug easier every part of the execution in isolation. In addition, following this approach you can avoid unnecessary closures in order to pass and share data across all the tasks in case a task needs some results from a task completed before.

## Implementations ##

Below you can find various trivial or real-world implementations of this pattern:

* [password-encryption](password-encryption.js): random salt encryption of a password with callbacks
* [triple-encryption](triple-encryption.js): triple encryption of a text with promises