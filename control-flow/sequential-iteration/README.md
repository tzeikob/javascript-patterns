# The Sequential Iteration Pattern #

The **sequential iteration** pattern is a special form of the **sequential execution** pattern, thus belongs to the category of the **async control flow** patterns. This pattern allows you to control the **execution** of asynchronous tasks in a **sequential order**, which means every task should be executed as part of a **chain** or **pipeline** of tasks. What makes this pattern special about sequential execution is that the tasks aren't known from the very beginning and most of the time are given in a more dynamic way like a collection of tasks.

## Explanation ##

In such a use case it could be impossible to hard code the invocation of each task, so we have to follow a different approach. The solution is to use a more dynamic iterative process. The sequential iteration pattern can be implemented using either old school **callbacks** along with recursion or the more development friendly **promises**, where either implementation should give us the same execution.

### Sequential iteration with callbacks ###

Assuming we have a collection of asynchronous tasks where each task is expecting two arguments, an `input` and a `callback`. We can define an `execution` function which accepts that collection of tasks along with an initial `input` and a `completion callback`, within that function we will use a helper function called `iterate` which will be responsible to manage the sequential execution. Keep in mind that we are passing information from a task to the next task by updating the local `input` value with the result of each task, this way we can share data between tasks.

```javascript
function execution (tasks, input, callback) {
  let value; // Completion value

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

> The result of each task is expected be the input to the next in order task.

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
execution(tasks, input, (error, result) => {
  if (error) {
    return console.error(error);
  }

  console.log(result);
});
```

Note that we can use custom objects in the place of the `input` variable if we need to be more flexible, what is the best practice depends on the requirements of our application.

### Sequential iteration with promises ###

A more elegant way to implement this pattern is to use **chaining promises** which will give us more readable and less verbose code in comparison to callbacks. In promises we know that a promise will resolve only **once** either fulfilled or rejected, so why not to wrap each task in a promise and chain them so to get that strictly sequential flow. Let's say we have the same tasks as before but this time instead of using async callback they return a promise.

```javascript
const tasks = [
  function tasks1 (input) {
    return new Promise((resolve, reject) => {...})
  },

  function tasks2 (input) {...},
  function tasks3 (input) {...},
  ...
];
```

Knowing that the `then` method of a promise returns another promise, we can use it to get the sequential execution of those tasks by chaining them. We will use the `Array.prototype.reduce` method on the given array of `tasks` to iteratively chain each task to the next one. Bear in mind that the value a promise resolves to will be the input to the next promise, that way each task gets as input the result of the previous.

```javascript
function execution (tasks, input) {
  // Make input first promise in the chain
  input = Promise.resolve(input);

  // Chain tasks in sequential order
  const promise = tasks.reduce((previous, task) => {
    return previous.then(task);
  }, input);

  return promise;
}

// Launch the execution
execution(tasks, input)
  .then((result) => {...})
  .catch((error) => {...});
```

> The resolved value of each promise (task) will be the input value of the next promise (task).

After we finish the iteration we only have to return the last in chain promise back to the caller where we use another `then` to handle the completion value. As you have noticed the error handling is now easier to implement just by using the `catch` method on the returned promise, any error thrown within the chain of promises will be caught here. So using promises we can skip boilerplate code and get cleaner and less verbose syntax which is easier to maintain.

## Considerations ##

### Use recursion with caution ###

Even thought using recursion in the iteration pattern might seem so powerful, you should take care and make good and fair use of this feature in order to avoid unexpected results such as **stack overflows**.

## Implementations ##

Below you can find various trivial or real-world implementations of this pattern:

* [reducer](reducer.js): reduce random integer numbers with callbacks
* [file-encryption](file-encryption.js): encrypt the content of a file with callbacks
* [accumulator](accumulator.js): accumulate a list of random even integers with promises