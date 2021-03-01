# The Sequential Execution Pattern #

The sequential execution pattern belongs to the category of those design patterns called **async control flow** patterns. That pattern allows you to control the **execution** of asynchronous tasks in a **sequential order**, which means every task should be executed as part of a **chain** or **pipeline** given an input and passing and output to the next task.

## Explanation ##

In a sequential control flow of asynchronous tasks, tasks could be known beforehand or unknown where are provided in a more dynamic way. Both scenarios could be implemented using callbacks along with the convention of the error always comes first.

### Sequential execution of known asynchronous tasks ###

In the use case where the asynchronous tasks are known we can hard code every invocation of a task to keep the order of the execution. According to this pattern we pass as arguments both the callback and data as input to the next task. Keeping the code readable by not using in-place function definitions along with splitting each tasks in a separate named function will give us cleaner and well structured code.

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
```

> Note: we are using the `setTimeout` method in order to mimic asynchronous tasks.

Bear in mind that we are using an output argument in the call of a task, this way we can share previous computed data to tasks down into the chain of execution without polluting the top scope via closures. The convention here is that the output of a task should be considered the input of the next in the line task, that input/output could be any type of value including custom objects.