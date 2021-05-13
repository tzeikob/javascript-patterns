# The Limited Parallel Execution Pattern

The limited parallel execution is another pattern which belongs to the category of **control flow** patterns and is a special version of the [parallel execution](../parallel-execution/readme.md) pattern. In use cases where we have limited number of resources (memory, cpu cycles, etc.) we should consider taking another approach by just invoking all tasks at once. Instead we can split the execution in batches of tasks run in **parallel** and wait to be notified when all of them are done.

We can think the limited parallel execution as a room where tasks can be running in parallel, but the space is bounded to accept only a limited number of such tasks. Every time a task in the room completes another pending task from the collection drops in and starts executing. The goal is to split the overhead of running too many tasks in parallel and avoid running out of resources. The execution of such pattern should be considered as completed only when all of the given tasks have been completed. In the case a task throws an error the execution should be rejected immediately skipping any result collected from other completed tasks so far.

## Implementation

This pattern can be implemented using either old school **callbacks** or the more development friendly **promises** and **async functions**, where either implementation should give us the same execution.

### Limited parallel execution with callbacks

Assume we have an `execution` function which expects a collection of asynchronous via callback `tasks`. Along with tasks the function requires a `concurrency` limit and a completion `callback`. The concurrency limit is the maximum number of tasks which can be running in parallel at any given time in execution. Along with the already known `completed` and `rejected` variables which have been used in the parallel execution pattern, here we will need two more variables. The variable `running` meant to store the actual number of running tasks at any given time and an `index` to point to the next task in invocation.

```javascript
function execution (tasks, concurrency, callback) {
  let completed = 0; // Total completed tasks
  let rejected = false; // Execution is rejected

  let running = 0; // Total running tasks
  let index = 0; // Index of the next task to invoke

  const results = []; // Store the result of each task
}
```

> The result of each task will be collected via closure into the `results` variable.

Now as you can see here we have the same `done` helper function we've used in parallel execution pattern. This function is passed as the callback to each task's invocation, but here has a slightly different behavior. When a task calls the done callback at completion, we have to count down the `running` variable in order to inform the execution that a task has finished and there is now room for another task to check in. The last thing to do is to call for another iteration by invoking the `next` function again, so other tasks can have the chance in execution.

```javascript
function execution (tasks, concurrency, callback) {
  ...

  function done (error, result) {
    if (rejected) {
        return;  // Exit if execution rejected by another task
    }

    if (error) {
      rejected = true; // Mark the rejection of the execution
      return callback(error); // Call back with the thrown error
    }

    completed++; // Count another task as completed
    results.push(result); // Store the task's completion result

    // Call completion back once all tasks are completed
    if (completed === tasks.length && !rejected) {
      callback(null, results);
    }

    running--; // Mark a spot as free in concurrency
    next(); // Trigger the next iteration
  }
}
```

> Bear in mind that the completion callback should always be called **once** either at rejection or completion along with the error or the result respectively.

The execution starts by calling a helper function `next` which via indirect recursion is handling which task is about to be pushed into the parallel execution by keeping the process under the limit of `concurrency`. As long as there is room for another task to be executed and there are still tasks not spawn, we invoke the next in order task.

```javascript
function execution (tasks, concurrency, callback) {
  ...

  function next () {
    // Call next task if there is room in concurrency
    while (running < concurrency && index < tasks.length) {
      // Get the task to invoke and mark the next to be ready
      const task = tasks[index];
      index++;

      task(done); // Invoke the task given the done as callback

      running++; // Mark that a spot is occupied in concurrency
    }
  }

  next(); // Launch iteration
}
```

Now let's put this all together.

```javascript
function execution (tasks, concurrency, callback) {
  let completed = 0; // Total completed tasks
  let rejected = false; // Execution is rejected

  let running = 0; // Total running tasks
  let index = 0; // Index of the next task to invoke

  const results = []; // Store the result of each task

  function done (error, result) {
    if (rejected) {
        return;  // Exit if execution rejected by another task
    }

    if (error) {
      rejected = true; // Mark the rejection of the execution
      return callback(error); // Call back with the thrown error
    }

    completed++; // Count another task as completed
    results.push(result); // Store the task's completion result

    // Call completion back once all tasks are completed
    if (completed === tasks.length && !rejected) {
      callback(null, results);
    }

    running--; // Mark a spot as free in concurrency
    next(); // Trigger the next iteration
  }

  function next () {
    // Call next task if there is room in concurrency
    while (running < concurrency && index < tasks.length) {
      // Get the task to invoke and mark the next to be ready
      const task = tasks[index];
      index++;

      task(done); // Invoke the task given the done as callback

      running++; // Mark that a spot is occupied in concurrency
    }
  }

  next(); // Launch iteration
}
```

Having a collection of asynchronous tasks is now easy to execute them in parallel like so.

```javascript
// A collection of trivially implemented asynchronous tasks
const tasks = [
  (callback) => setTimeout(() => callback(null, "Task1")),
  (callback) => setTimeout(() => callback(null, "Task2")),
  (callback) => setTimeout(() => callback(null, "Task3"))
];

execution(tasks, concurrency, (error, results) => {
  if (error) {
    return console.error(error);
  }

  console.log(results);
});
```

> Note that we skip error handling within async tasks for brevity, but you always have take care of thrown errors.

### Limited parallel execution with promises

Using promises we can improve the previous implementation by making the code more readable and maintainable. In this case we have one important difference, both every task and the `execution` function instead of using callbacks should now return a promise. Within the execution function we have a local nested `executor` function. In general this function is responsible to keep pulling available tasks from the given `tasks` queue and execute them, where each result should be collected into the `results` variable. When no task has been left into the queue the executor should terminate.

In order to do this in asynchronous way we should wrap all this into a `promise` so this function returns a promise. Within the execution code of this promise we have another function called `loop` which first checks if there are tasks for execution and if there are pulls one and executes it, otherwise calls the `resolve` in order to terminate the executor. When a task is fulfilled we have to collect the `result` and then call for another loop via recursion. In case an error has been thrown we should call the `reject` to immediately terminate the executor.

```javascript
function execution (tasks, concurrency) {
  const results = [];

  function executor () {
    return new Promise((resolve, reject) => {
      function loop () {
        if (tasks.length === 0) {
          return resolve(); // Terminate when there is no task to execute
        }

        const task = tasks.shift(); // Pull the next task

        task() // Execute the task
          .then((result) => results.push(result)) // Collect the result
          .then(loop) // Keep looping for more tasks
          .catch(reject); // Reject early if an error has been thrown
      }
      
      loop(); // Trigger the first loop
    });
  }
}
```

> Each task within the `loop` function is invoked in subsequent event loop cycles in order to not block the single thread.

Now we can follow the concept of `executors` and execute tasks concurrently by just invoking many times the executor function and keeping the references to their promises. When all of them terminate (resolve) we return a final `promise` which resolves to the collected `results`. Given the `concurrency` limit we expect to have a number of executors equal to this value.

```javascript
function execution (tasks, concurrency) {
  ...

  const executors = [];

  // Launch a limited number of concurrent executors
  for (let i = 0; i < concurrency; i++) {
    executors[i] = executor(); // Collect executor's promise
  }

  // Resolve with the collected results
  const promise = Promise.all(executors).then(() => results);

  return promise;
}
```

Now let's put all this together.

```javascript
function execution (tasks, concurrency) {
  const results = [];

  function executor () {
    return new Promise((resolve, reject) => {
      function loop () {
        if (tasks.length === 0) {
          return resolve(); // Terminate when there is no task to execute
        }

        const task = tasks.shift(); // Pull the next task

        task() // Execute the task
          .then((result) => results.push(result)) // Collect the result
          .then(loop) // Keep looping for more tasks
          .catch(reject); // Reject early if an error has been thrown
      }
      
      loop(); // Trigger the first loop
    });
  }

  const executors = [];

  // Launch a limited number of concurrent executors
  for (let i = 0; i < concurrency; i++) {
    executors[i] = executor(); // Collect executor's promise
  }

  // Resolve with the collected results
  const promise = Promise.all(executors).then(() => results);

  return promise;
}
```

The following code launches the execution of asynchronous tasks at a given concurrency limit.

```javascript
// A collection of trivially implemented asynchronous tasks
const tasks = [
  () => new Promise((resolve) => setTimeout(() => resolve("Task1"))),
  () => new Promise((resolve) => setTimeout(() => resolve("Task2"))),
  () => new Promise((resolve) => setTimeout(() => resolve("Task3")))
];

execution(tasks, concurrency)
  .then((results) => {
    console.log(results);
  })
  .catch((error) => {
    console.error(error);
  });
```

> Note we skip any promise rejection within asynchronous tasks for brevity, but you always have to take care of rejections.

### Limited parallel execution with async/await

We can improve the previous implementation even more by changing only the internals of the execution and using async functions along with await expressions. One important difference here is that the `execution` function should now be an `async` function instead. Within the execution function there is a local async function called `executor`, this function is responsible to keep running as long as there are available `tasks` for invocation, otherwise should terminate and resolve immediately. The executor should check if there is at least one task in the `tasks` queue and if there is removes it from the queue and executes it. Any `result` resolved by an asynchronous task should be collected into the local `results` variable. The task is executed by using `await` which makes sure that the `while` loop is not blocking the event loop because the next iteration is scheduled for the next subsequent cycle.

```javascript
async function execution (tasks, concurrency) {
  const results = [];

  async function executor () {
    // Iterate as long as there are available tasks
    while (tasks.length > 0) {
      const task = tasks.shift(); // Pull the next task
      const result = await task(); // Await the task to resolve

      results.push(result); // Collect the result
    }
  }
}
```

Having the executor function we can now create concurrency by just invoking the executor function many times equal to the given `concurrency` limit. The execution will resolve to the collected `results` only after all tasks have been resolved and each executor is terminated.

```javascript
async function execution (tasks, concurrency) {
  ...

  const executors = [];

  // Launch a limited number of concurrent executors
  for (let i = 0; i < concurrency; i++) {
    executors[i] = executor(i); // Collect executor's promise
  }

  await Promise.all(executors); // Await until all executors resolve

  return results;
}
```

Now let's put all this together.

```javascript
async function execution (tasks, concurrency) {
  const results = [];

  async function executor () {
    // Iterate as long as there are available tasks
    while (tasks.length > 0) {
      const task = tasks.shift(); // Pull the next task
      const result = await task(); // Await the task to resolve

      results.push(result); // Collect the result
    }
  }

  const executors = [];

  // Launch a limited number of concurrent executors
  for (let i = 0; i < concurrency; i++) {
    executors[i] = executor(i); // Collect executor's promise
  }

  await Promise.all(executors); // Await until all executors resolve

  return results;
}
```

> Any error thrown within the execution will be caught via the `catch` method of the returning promise.

Assuming we have a list of asynchronous tasks we can launch the execution like so.

```javascript
// A collection of trivially implemented asynchronous tasks
const tasks = [
  () => new Promise((resolve) => setTimeout(() => resolve("Task1"))),
  () => new Promise((resolve) => setTimeout(() => resolve("Task2"))),
  () => new Promise((resolve) => setTimeout(() => resolve("Task3")))
];

execution(tasks, input)
  .then((results) => {
    console.log(results);
  })
  .catch((error) => {
    console.error(error);
  });
```

## Considerations

### Race conditions

In parallel programming the most critical part is to keep consistency to the shared context between every task. Even though JavaScript engine implementations are single-threaded environments and there is not need to use techniques such as locks, mutexes and the like, the possibility of race conditions is **not guaranteed** to not happen. So you have to double check the computations taking place within a task running in parallel and the delay it takes to return its result to the others as this is often the reason of such race conditions.

## Use Cases

Below you can find various trivial or real-world implementations of this pattern:

* [Stop Words](stop-words.js): Find how many stop words a given list of words has with callbacks
* [Unicode Mapper](unicode-mapper.js): Map japanese words to their unicode equivalent with promises
* [Sales](sales.js): Reduce to the total amount of sales from different sources with async/await