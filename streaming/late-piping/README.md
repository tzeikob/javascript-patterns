# The Late Piping Pattern

The sequential execution pattern belongs to the category of those design patterns called **control flow** patterns. This pattern allows you to control the **execution** of asynchronous tasks in a **sequential order**, which means that every task should be executed as part of a **chain** or **pipeline** of tasks.

According to this pattern each completed task should invoke the next in order task passing its result as input to the next one. The execution should continue until the last in order task completes, by which time the execution is considered as completed. In case any task in the sequence throws an error the execution should be rejected immediately along with the given error. The execution should be either fulfilled or rejected and no intermediate state should be allowed.

## Implementation

The sequential execution pattern can be implemented using either old school **callbacks** or the more development friendly **promises** and **async functions**, where either implementation should give us the same execution.

### Sequential execution with callbacks

Let's start by making the assumption that a sequential execution of tasks should be started given two arguments, an `input` and the completion `callback`. Each task in execution is responsible to invoke the next in order task passing both the completion callback along with any result computed so far. In case an error is thrown at any given time, the execution should be rejected immediately by invoking the completion callback with the error. One critical rule is that the completion callback should be called only **once** in either rejection or completion.

In order to keep our code as clean as possible we can split the execution of each task in separate functions instead of hard coding invocations within the lexical scope of a single function. Now assume we have an `api` module which exposes some asynchronous via callback operations, each of those operations expects two arguments, an input and a callback. The following code is an implementation of a sequential execution of three tasks each using its corresponding operation.

```javascript
import { operationA, operationB, operationC } from "api";

function execution (input, callback) {
  task1(input, callback); // Call the first task
}

function task1 (input, callback) {
  // Execute asynchronous operation A
  operationA(input, (error, result) => {
    if (error) {
      return callback(error); // Call back early with error
    }

    // Call next task passing both result and callback
    task2(result, callback);
  });
}

function task2 (input, callback) {
  // Execute asynchronous operation B
  operationB(input, (error, result) => {
    if (error) {
      return callback(error); // Call back early with error
    }

    // Call next task passing both result and callback
    task3(result, callback);
  });
}

function task3 (input, callback) {
  // Execute asynchronous operation C
  operationC(input, (error, result) => {
    if (error) {
      return callback(error); // Call back early with error
    }

    // Call back with the result of completion
    callback(null, result);
  });
}
```

> Splitting each task in a separate named function will give us a cleaner and well structured code.

Now let's launch the execution, like so:

```javascript
execution(input, (error, result) => {
  if (error) {
    return console.error(error);
  }

  console.log(result);
});
```

Bear in mind that we are using an input argument in the call of a task, this way we can share previous computed data to tasks down into the chain of execution without polluting the top scope via closures. The convention here is that the output of a task should be considered the input of the next task, where input/output could be any type of value including custom objects.

## Considerations

### Avoid the callback hell anti-pattern

By using in-place anonymous function definitions where we have to place a callback is considered a very bad practice when you have a list of tasks which must be executed one after the other. The reason is that this will eventually result in the chaos of an unreadable code (pyramid of doom), hard to maintain, debug and test. So avoid doing the following when you have to control the execution of asynchronous tasks.

```javascript
function execution (input, callback) {
  operationA(input, (error, result) => {
    if (error) {
      return callback(error);
    }

    operationB(result, (error, result) => {
      if (error) {
        return callback(error);
      }

      operationC(result, (error, result) => {
        if (error) {
          return callback(error);
        }

        callback(null, result);
      });
    });
  });
});
```

Instead try to split your code into named function definitions per task, this way you can test and debug easier every part of the execution in isolation. In addition, following this approach you can avoid unnecessary closures in order to pass and share data across all the tasks in case a task needs some results from a task completed before.

## Use Cases

Below you can find various trivial or real-world implementations of this pattern:

* [Password Encryption](password-encryption.js): Encrypt randomly salted passwords with callbacks