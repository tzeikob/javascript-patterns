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

### Sequential iteration of unknown asynchronous tasks ###

The other use case of sequential execution is where we can not known the asynchronous tasks in the first place. In this case it could be impossible to hard code the invocation of each task, so we have to follow a different approach. The solution is to use a more dynamic iteration pattern along with the powerful recursion mechanism. Let's say with have a definition of an asynchronous task which accepts only an initial input value in order to compute an outcome.

```javascript
function task (input, callback) {
  setTimeout(() => {
    try {
      // Execute the task's business logic
      const output = ...

      // Call back with the completion output value
      callback(null, output);
    } catch (error) {
      callback(error);
    }
  });
}
```

Now assume we are in another function where we have a collection of such tasks, at that point we need to start the invocation of the first in the order task and propagate the execution in a sequential manner until we execute all tasks. Along with the collection of tasks we have an initial input and the callback to be invoked at completion. We can use recursion in order to achieve this result.

```javascript
function operation (tasks, value, callback) {
  function iterate (index) {
    // Check if we reached completion
    if (index === tasks.length) {
      return callback(null, value);
    }

    // Execute the next task
    const task = tasks[index];
    task(value, (error, result) => {
      if (error) {
        return callback(error);
      }

      // Pass the result as input to the next task
      value = result;

      // Call to the next iteration
      iterate(index + 1);
    });
  }

  // Launch iteration
  iterate(0);
}
```

Keep in mind that we are passing information from a task to the next task by updating the current value variable with the result of each task at a time, this way we can share data between tasks. Bear in mind that we can use custom objects in the place of the value variable if we need to be more flexible according to our requirements.

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

Instead try to split your code into named function definitions per task, this way you can test and debug easier every part of the execution in isolation. In addition following this approach you can avoid unnecessary closures in order to pass and share data across all the tasks (what if a task needs the result of the first task?).

### Use recursion with caution ###

Even thought using recursion in the iteration pattern might seem so powerful, you should take care and make a good use of this feature in order to avoid unexpected results such as stack overflows.