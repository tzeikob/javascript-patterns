# The Sequential Execution Pattern #

The **sequential execution** pattern belongs to the category of those design patterns called **async control flow** patterns. That pattern allows you to control the **execution** of asynchronous tasks in a **sequential order**, which means every task should be executed as part of a **chain** or **pipeline** given an input and passing and output to the next task.

## Explanation ##

In a sequential control flow of asynchronous tasks, tasks could be known beforehand or unknown provided in a more dynamic way. In the use case where the asynchronous tasks are known we can hard code every invocation of a task to keep the order of the execution. According to this pattern we pass as arguments both the callback and data as input to the next task. Keeping the code readable by not using in-place function definitions along with splitting each task in a separate named function will give us a cleaner and well structured code.

```javascript
function task1 (input, callback) {
  setTimeout(() => {
    try {
      // Execute task1's business logic
      const output = ...

      // Call the next task passing more context and callback
      task2(output, callback);
    } catch (error) {
      callback(error);
    }
  });
}

function task2 (input, callback) {
  setTimeout(() => {
    try {
      // Execute task2's business logic
      const output = ...

      // Call the next task passing more context and callback
      task3(output, callback);
    } catch (error) {
      callback(error);
    }
  });
}

function task3 (input, callback) {
  setTimeout(() => {
    try {
      // Execute task3's business logic
      const output = ...

      // Call back with the result of completion
      callback(null, output);
    } catch (error) {
      callback(error);
    }
  });
}

// Launch the execution
task1(input, (error, result) => {
  ...
});
```

> Note: we are using the `setTimeout` method in order to mimic the asynchronous execution of a task.

Bear in mind that we are using an output argument in the call of a task, this way we can share previous computed data to tasks down into the chain of execution without polluting the top scope via closures. The convention here is that the output of a task should be considered the input of the next in the line task, that input/output could be any type of value including custom objects.

## Implementations ##

Below you can find various trivial or real-world implementations of this pattern:

* [text-counter](text-counter.js): a trivial example of counting chars, words and spaces in a phrase

## Considerations ##

### Avoid the callback hell anti-pattern ###

By using in-place anonymous function definitions where we have to place a callback is considered a very bad practice. The reason is that this will eventually result in the chaos of an unreadable code (pyramid of doom), hard to maintain, debug and test. So avoid doing the following when you have to control the execution of asynchronous tasks:

```javascript
task1(input, (error, result) => {
  if (error) {
    return console.log(error);
  }

  task2(result, (error, result) => {
    if (error) {
      return console.log(error);
    }

    task3(result, (error, result) => {
      if (error) {
        return console.log(error);
      }

      return result;
    });
  });
});
```

Instead try to split your code into named function definitions per task, this way you can test and debug easier every part of the execution in isolation. In addition, following this approach you can avoid unnecessary closures in order to pass and share data across all the tasks in case a task down the chain needs some results from a task completed before.