# The Sequential Iteration Pattern #

The **sequential iteration** pattern is a special form of the **sequential execution** pattern, thus belongs to the category of the **async control flow** patterns. That pattern allows you to control the **execution** of asynchronous tasks in a **sequential order**, which means every task should be executed as part of a **chain** or **pipeline** given an input and passing and output to the next task until completion.

## Explanation ##

What makes this pattern special about sequential execution is that the tasks aren't known from the very beginning. In a sequential control flow of asynchronous tasks, tasks could be either known beforehand or unknown and provided in a more dynamic way as a collection of tasks. Sequential iteration is more about implementations belong to the latter case.

In such a case it could be impossible to hard code the invocation of each task, so we have to follow a different approach. The solution is to use a more dynamic iteration pattern along with the powerful recursion mechanism. Let's say with have a definition of an asynchronous task which accepts only an initial input value in order to compute an outcome.

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

> Note: we are using the `setTimeout` method in order to mimic the asynchronous execution of a task.

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

// Launch the execution
operation(tasks, value, (error, result) => {
  ...
});
```

Keep in mind that we are passing information from a task to the next task by updating the current value variable with the result of each task at a time, this way we can share data between tasks. Bear in mind that we can use custom objects in the place of the value variable if we need to be more flexible according to our requirements.

## Implementations ##

Below you can find various trivial or real-world implementations of this pattern:

* [reducer](reducer.js): a trivial example of a reducer of random integer numbers

## Considerations ##

### Use recursion with caution ###

Even thought using recursion in the iteration pattern might seem so powerful, you should take care and make good and fair use of this feature in order to avoid unexpected results such as **stack overflows**.