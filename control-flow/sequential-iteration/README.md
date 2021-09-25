# The Sequential Iteration Pattern

The sequential iteration pattern is a special version of the [sequential execution](../sequential-execution/README.md) pattern. Both of these patterns allow you to control the **execution** of asynchronous tasks in a **sequential order**, which means every task should be executed as part of a **chain** or **pipeline** of tasks. What makes this pattern special over the sequential execution pattern, is that the tasks aren't known from the very beginning and most of the time are given in a more dynamic way like an array or list of tasks.

Apart from this variation in the way the tasks are given, this pattern works the same way the sequential execution pattern works. So we expect that each completed task should invoke the next in order task passing its result as input to the next one. The execution should continue as long as the last in order task completes, by which time the execution is considered as completed. In case any task in the sequence throws an error the execution should be rejected immediately along with the given error. The execution should be either fulfilled or rejected and no intermediate state should be allowed.

## Implementation

Having the tasks given as a dynamic collection it could be impossible to hard code the invocation of each task, so we have to follow a different approach. The solution is to use a more dynamic **iterative** process. The sequential iteration pattern can be implemented using either old school **callbacks** along with recursion or the more development friendly **promises** and **async functions**, where either implementation should give us the same execution.

### Sequential iteration with callbacks

Assuming we have a collection of asynchronous tasks where each task is expecting two arguments, an `input` and a `callback`. We can define an `execution` function which accepts a collection of `tasks` along with an initial `input` and a completion `callback`. Within that function we will use another helper function called `iterate` which will be responsible to manage the sequential execution. This function will start being called recursively until the last task in the collection completes or an error is thrown. Keep in mind that we are passing information from a task to the next task by updating the local `input` value with the `output` of each task per iteration. Each task has access also to a shared local variable called `result`, where the completion value of the execution can be stored. Note that, as with sequential execution pattern, the completion callback should be called only **once** in either rejection or completion.

```javascript
function execution (tasks, input, callback) {
  let result; // Completion result value

  function iterate (index) {
    if (index === tasks.length) {
      return callback(null, result); // Call back at completion
    }

    // Execute the next in order task
    const task = tasks[index];

    task(input, (error, output) => {
      if (error) {
        return callback(error); // Reject immediately
      }

      // Pass the output as input for the next task
      input = output;

      // Execute any business logic
      result = ...

      // Call for the next iteration
      iterate(index + 1);
    });
  }

  // Launch the iteration
  iterate(0);
}
```

> The output of each task is expected to be the input to the next in order task.

The `execution` function launches the iteration given an `index` equal to `0`, which means the first in order task will be invoked. By using an `index` value we are pointing to the next task in execution at each iteration, so every time a task completes we should call the `iterate` again given the next index. This indirect recursion will give us the sequential flow of the execution. When the index reaches the total number of tasks the execution should be considered completed and the completion callback is called back with the `result` value. Bear in mind that if an error is thrown at any given time, the execution should be terminated and immediately call the completion callback along with the thrown error. Now assume we have a given collection of asynchronous tasks, this is how we will execute them in sequential order.

```javascript
// A collection of trivial asynchronous tasks
const tasks = [
  (input, callback) => setTimeout(() => callback(null, "Task1")),
  (input, callback) => setTimeout(() => callback(null, "Task2")),
  (input, callback) => setTimeout(() => callback(null, "Task3"))
];

execution(tasks, input, (error, result) => {
  if (error) {
    return console.error(error);
  }

  console.log(result);
});
```

> Within each task we skip both any business logic and error handling only for brevity.

### Sequential iteration with promises

A more elegant way to implement this pattern is to use **chaining promises** which will give us more readable and less verbose code in comparison to callbacks. In promises we know that a promise will resolve only **once** either fulfilled or rejected, so why not to wrap each task in a promise and chain them so to get that strictly sequential flow. Let's say we have the same tasks as before but this time instead of using callback they return a promise.

```javascript
// A collection of trivial asynchronous tasks
const tasks = [
  (input) => new Promise((resolve) => setTimeout(() => resolve("Task1"))),
  (input) => new Promise((resolve) => setTimeout(() => resolve("Task2"))),
  (input) => new Promise((resolve) => setTimeout(() => resolve("Task3")))
];
```

> Again, we skip both business logic and error handling only for brevity.

Knowing that the `then` method of a promise returns another promise, we can use it to get the sequential execution of those tasks by chaining them. We will use the `Array.prototype.reduce` method on the given array of `tasks` to iteratively chain each task to the next one. Bear in mind that the value a promise resolves to, will be the input to the next promise. That way each task gets as input the result of the previous.

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
```

> The resolved value of each promise (task) will be the input value of the next promise (task).

After we finish the iteration we only have to return the last in chain promise back to the caller where we use another `then` to handle the completion value. In order to invoke the execution we only need to run the following code.

```javascript
execution(tasks, input)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
```

As you have noticed the error handling is now easier to implement just by using the `catch` method on the returned promise, any rejected promise in the chain will be caught here as an error. So using promises we can skip boilerplate code and get cleaner and less verbose syntax which is easier to maintain.

### Sequential iteration with async/await

With async/await this pattern can be implemented in a more elegant way by implementing an async `execution` function along with await expressions. Let's say we have the same collection of tasks returning promises as before.

```javascript
// A collection of trivial asynchronous tasks
const tasks = [
  (input) => new Promise((resolve) => setTimeout(() => resolve("Task1"))),
  (input) => new Promise((resolve) => setTimeout(() => resolve("Task2"))),
  (input) => new Promise((resolve) => setTimeout(() => resolve("Task3")))
];
```

Within the `execution` function we only need to iterate through the collection of `tasks` and invoke each one via an `await` expression, where the input of each task should be the result of the previous. The return value of this function is expected to be a promise instance on which we can chain both the `then` and `catch` handlers in order to manage the fulfillment and the rejection of the execution.

```javascript
async function execution (tasks, input) {
  let result;

  // Iterate over the collection of tasks
  for (const task of tasks) {
    result = await task(input); // Await until the task is fulfilled

    // Set the input of the next task
    input = result;
  }

  return result;
}
```

> Within the execution function any thrown exception of rejected promise will trigger the `catch` handler of the returned promise.

Having the async execution function returning a promise, this is how we invoke the execution of a given collection of tasks in sequential order.

```javascript
execution(tasks, input)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
```

## Considerations

### Use recursion with caution

Even though using recursion in the iteration pattern might seem so powerful, you should take care and make good and fair use of this feature in order to avoid unexpected results such as **stack overflows**.

### Avoid the anti-pattern use of async/await

One common pitfall using await expressions when we need to call a collection of tasks in sequential way is to use the `Array.prototype.forEach` method, like so:


```javascript
function execution (tasks, input) {
  tasks.forEach(async (task) => {
    await task(input);
  });
}
```

The issue with this code is that in every invocation of the given async callback in `forEach`, the returned promise will be ignored and so no task will wait for the completion of the previous in order task. This code is like executing all the tasks at once in parallel and not in sequential order, so be very careful.

## Use Cases

Below you can find various trivial or real-world implementations of this pattern:

* [Text Processing](text-processing.js): Pass a given phrase through various text processors with callbacks
* [Filter](filter.js): Apply various filters to a given array of strings with promises
* [Middleware](middleware.js): Add sequential middleware actions to a given function with async/await