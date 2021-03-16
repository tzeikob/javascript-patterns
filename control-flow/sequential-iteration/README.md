# The Sequential Iteration Pattern #

The **sequential iteration** pattern is a special form of the **sequential execution** pattern, thus belongs to the category of the **async control flow** patterns. This pattern allows you to control the **execution** of asynchronous tasks in a **sequential order**, which means every task should be executed as part of a **chain** or **pipeline** of tasks. What makes this pattern special about sequential execution is that the tasks aren't known from the very beginning and most of the time are given in a more dynamic way like a collection of tasks.

## Explanation ##

In such a use case it could be impossible to hard code the invocation of each task, so we have to follow a different approach. The solution is to use a more dynamic iterative process powered with the enormous recursion mechanism.

Assuming we have a collection of asynchronous tasks where each task is expecting two arguments, an `input` and a `callback`. We can define an `execution` function which accepts that collection of tasks along with an initial `value` and a `completion callback`, within that function we will use a helper function called `iterate` which will be responsible to manage the sequential execution. Keep in mind that we are passing information from a task to the next task by updating the local `input` value with the result of each task, this way we can share data between tasks.

```javascript
function execution (tasks, value, callback) {
  let input = value; // Set the input of the first task

  function iterate (index) {
    // Call back at completion
    if (index === tasks.length) {
      return callback(null, value);
    }

    // Execute the next in order task
    const task = tasks[index];

    task(input, (error, result) => {
      if (error) {
        return callback(error);
      }

      // Pass the result as input for the next task
      input = result;

      // Update the completion value
      value = ...

      // Call for the next iteration
      iterate(index + 1);
    });
  }

  // Launch the iteration
  iterate(0);
}
```

> The input of each task could be the result of the previous in order task.

This function calls recursion in order to invoke each task by using an `index` value pointing to the next task in execution. When the index reaches the total number of tasks the execution should be considered completed and the completion callback is called back with the resulting value. Bear in mind that if an error is thrown at any given time, the execution should be terminated and immediately call the completion callback along with the thrown error. Now assume we have a given collection of asynchronous tasks, this is how we will execute them in sequential order.

```javascript
// A collection of asynchronous tasks
const tasks = [
  function task1 (input, callback) {...},
  function task2 (input, callback) {...},
  function task3 (input, callback) {...},
  ...
];

// Launch the execution of tasks
execution(tasks, value, (error, result) => {
  if (error) {
    return console.error(error);
  }

  console.log(result);
});
```

Note that we can use custom objects in the place of the `value` variable if we need to be more flexible, what is the best practice depends on the requirements of our application.

## Considerations ##

### Use recursion with caution ###

Even thought using recursion in the iteration pattern might seem so powerful, you should take care and make good and fair use of this feature in order to avoid unexpected results such as **stack overflows**.

## Implementations ##

Below you can find various trivial or real-world implementations of this pattern:

* [reducer](reducer.js): a trivial example of a reducer of random integer numbers