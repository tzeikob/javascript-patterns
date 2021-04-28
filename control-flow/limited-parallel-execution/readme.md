# The Limited Parallel Execution Pattern #

The limited parallel execution pattern belongs to the category of those design patterns called **async control flow** patterns and is a special version of the [parallel execution](../parallel-execution/readme.md) pattern. In use cases where we have limited number of resources (memory, cpu cycles) we should consider taking another approach by just invoking all tasks at once. Instead we can split the execution in batches of tasks run in **parallel** and wait to be notified when all of them are done.

## Explanation ##

The execution of such pattern should be considered as completed when all given tasks have been completed, unless a task throws an error which means that the execution should be rejected along with the thrown error. This pattern can be implemented using either old school **callbacks** or the more development friendly **promises** and **async functions**, where either implementation should give us the same execution.

### Limited parallel execution with callbacks ###

Assume we have an `execution` function which expects a collection of asynchronous `tasks` along with an `input`, the `concurrency` limit and the completion `callback`. The concurrency limit is the maximum number of tasks which can be running in parallel at any given time in execution. Along with the already known `completed` and `rejected` variables which are used in the parallel execution pattern, here we have two more variables. The variable `running` meant to store the actual number of running tasks at any given time and an `index` to point to the next in invocation task.

```javascript
function execution (tasks, input, concurrency, callback) {
  let completed = 0; // Total completed tasks
  let rejected = false; // Indicate if a task thrown an error

  let running = 0; // Total running tasks
  let index = 0; // Index of the next task to invoke

  const results = []; // Store the result of each task
}
```

> The result of each task will be collected via closure into the variable called `results`.

Now as you can see here we have the same `done` helper function we've used in parallel execution pattern. This function is passed as callback to each task's invocation, but here has a slightly different behavior. When a task calls the done function at completion we have to count down the `running` variable in order to inform the execution that a task has finished and there is now room for another task to take action.

```javascript
function execution (tasks, input, concurrency, callback) {
  ...

  function done (error, result) {
    if (error) {
      if (rejected) {
        return; // Don't call back if execution rejected by another task
      }

      // Inform all tasks about rejection and call back early
      rejected = true;
      return callback(error);
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

The execution starts by calling a helper function `next` which via indirect recursion is handling which task is about to be pushed in the parallel execution by keeping at the same time the limit of concurrency. As long as there is room for another task to be executed and there are still tasks not spawn, we invoke the next in order task.

```javascript
function execution (tasks, input, concurrency, callback) {
  ...

  function next () {
    // Call next task if there is room in concurrency
    while (running < concurrency && index < tasks.length) {
      // Get the task to invoke and mark the next to be ready
      const task = tasks[index];
      index++;

      task(input, done); // Invoke the task

      running++; // Mark that a spot is occupied in concurrency
    }
  }

  next(); // Launch iteration
}
```

Now let's put this all together.

```javascript
function execution (tasks, input, concurrency, callback) {
  let completed = 0; // Total completed tasks
  let rejected = false; // Indicate if a task thrown an error

  let running = 0; // Total running tasks
  let index = 0; // Index of the next task to invoke

  const results = []; // Store the result of each task

  function done (error, result) {
    if (error) {
      if (rejected) {
        return; // Don't call back if execution rejected by another task
      }

      // Inform all tasks about rejection and call back early
      rejected = true;
      return callback(error);
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

      task(input, done); // Invoke the task

      running++; // Mark that a spot is occupied in concurrency
    }
  }

  next(); // Launch iteration
}
```

Having a collection of tasks is now easy to execute them in parallel.

```javascript
// A collection of asynchronous tasks
const tasks = [
  function task1 (input, callback) {...},
  function task2 (input, callback) {...},
  function task3 (input, callback) {...},
  ...
];

// Launch the execution
execution(tasks, input, concurrency, (error, results) => {...});
```

We can think the limited parallel execution as a room where tasks can be run in parallel, but the space is bounded to accept only a limited number of tasks. Every time a task in the room completes another task from the collection drops in and starts executing. The goal is to split the overhead of running too many tasks in parallel and avoid running out of resources.

### Limited parallel execution with promises ###

The same pattern could be implemented with promises but taking a slightly different approach, especially when handling the resolution of each spawn task. Assuming we have the same `execution` function expecting the collection of `tasks`, an `input` and the `concurrency` limit but the completion callback. As each task is now considered that returns a promise, in this implementation we don't have to use the helper function `done`, instead we will use the promise's methods `then`, `catch` and `finally` in order to decide what's next after a task completes or rejects. The same `next` function is used which is responsible to invoke each task and manage the concurrency limitations at the same time.

```javascript
function execution (tasks, input, concurrency) {
  let running = 0; // Total running tasks
  let index = 0; // Index of the next task to invoke
  let thrownError = null; // Thrown error by a task

  const results = []; // Store the result of each task

  return new Promise((resolve, reject) => {
    function next () {
      // Call next task if there is room in concurrency
      while (running < concurrency && index < tasks.length) {
        // Get the task to invoke and mark the next to be ready
        const task = tasks[index];
        index++;

        // Invoke the task
        task(input)
          .then((result) => {
            results.push(result); // Register the result at completion
          })
          .catch((error) => {
            thrownError = error; // Register the error at rejection
          })
          .finally(() => {
            if (thrownError) {
              reject(thrownError); // If an error is thrown reject immediately
            } else {
              // Check if all tasks completed
              if (results.length < tasks.length) {
                // Count down to leave space of the next task
                running--;
                next();
              } else {
                resolve(results); // Resolve with the results
              }
            }
          });

        // Count up to reserve a slot in concurrency
        running++;
      }
    }

    next();
  });
}
```

Keep in mind that the function returns a promise instance in order to handle both the fulfillment and rejection of the execution. The execution is actually wrapped with this promise, where its `resolve` handler will be invoked by the task which completes last and its `reject` handler called by the task rejects first. The following code launches the execution of a given collection of tasks and a concurrency limit.

```javascript
// A collection of asynchronous tasks
const tasks = [
  function tasks1 (input) {
    return new Promise((resolve, reject) => {...})
  },
  function tasks2 (input) {...},
  function tasks3 (input) {...},
  ...
];

// Launch the execution
execution(tasks, input, concurrency)
  .then((results) => {...})
  .catch((error) => {...});
```

> Be aware that each task should now return a promise and not use a callback to resolve.

### Limited parallel execution with async/await ###

We can implement the same pattern in another way by using async functions along with await expressions without changing anything in the API. So having the same input the `execution` function should now be an async function with the same parameters as before. The first thing to notice is that we can only use two local variables, the `queue` as the list of tasks to be registered for invocation at any given time, along with the list of `results` which will be collected during the execution.

Within the execution function we have a local async function called `next`, this function is responsible to keep adding tasks to the queue as long as there is room for new tasks regarding the `concurrency` limit. So when there is no task left to be pushed in the queue this function should complete. Think about this function as running as long as there is a task to be invoked, so any task added to the queue should be removed from the `tasks` list otherwise the next function will never complete. In order to keep this running we are using and endless `while` loop pausing each iteration in subsequent cycles to avoid blocking the event loop.

```javascript
async function execution (tasks, input, concurrency) {
  const queue = []; // Current queue of tasks to be invoked
  const results = []; // Results have been collected

  async function next () {
    while (true) {
      if (tasks.length === 0) {
        return; // If you run out of tasks then complete
      }

      // Add the next task if there is room in concurrency
      if (queue.length < concurrency) {
        const task = tasks.shift();
        queue.push(task);
      }

      // Proceed to the next iteration in the next event loop cycle
      await new Promise((resolve) => setImmediate(resolve));
    }
  }
}
```

Having a mechanism to push tasks in the queue, we now need a way to start executing them concurrently. We are going to do this by using the concept of `executors`, where each executor is just an async function launched in parallel and responsible to execute available tasks pushed in the queue. Each executor should terminate only after there is no tasks left to be pushed into the queue and the queue is empty of tasks. As with the `next` function each executor should run as long there are tasks to be invoked. Reasonably the number of executors is expected to be equal to the concurrency limit.

```javascript
async function execution (tasks, input, concurrency) {
  ...

  const executors = [];

  // Create executors equal to the limit of concurrency
  for (let i = 0; i < concurrency; i++) {
    executors[i] = async () => {
      while (true) {
        if (queue.length === 0 && tasks.length === 0) {
          return; // Complete if the is no task and the queue is empty
        }

        // Pull out the next task in the queue
        const task = queue.shift();

        if (task) {
          const result = await task(input); // Execute the task
          results.push(result); // Collect the result
        } else {
          // Proceed to the next iteration in the next event loop cycle
          await new Promise((resolve) => setImmediate(resolve));
        }
      }
    }
  }
}
```

> Again, we avoid blocking the event loop by pausing this endless while for the next cycle via await expressions.

We are now ready to execute both the next function and each executor in parallel via the `Promise.all` method. The key point here is that even though these functions are sharing both the `queue` and the `tasks` lists, there is not need for any locks or mutexes because everything in javascript is running in a single thread.

```javascript
async function execution (tasks, input, concurrency) {
  ...

  // Launch the next and any executor in parallel
  const n = next();
  const e = executors.map(ex => ex());
  await Promise.all([n, ...e]);

  return results;
}
```

Now let's put all this together.

```javascript
async function execution (tasks, input, concurrency) {
  const queue = []; // Current queue of tasks to be invoked
  const results = []; // Results have been collected

  async function next () {
    while (true) {
      if (tasks.length === 0) {
        return; // If you run out of tasks then complete
      }

      // Add the next task if there is room in concurrency
      if (queue.length < concurrency) {
        const task = tasks.shift();
        queue.push(task);
      }

      // Proceed to the next iteration in the next event loop cycle
      await new Promise((resolve) => setImmediate(resolve));
    }
  }

  const executors = [];

  // Create executors equal to the limit of concurrency
  for (let i = 0; i < concurrency; i++) {
    executors[i] = async () => {
      while (true) {
        if (queue.length === 0 && tasks.length === 0) {
          return; // Complete if the is no task and the queue is empty
        }

        // Pull out the next task in the queue
        const task = queue.shift();

        if (task) {
          const result = await task(input); // Execute the task
          results.push(result); // Collect the result
        } else {
          // Proceed to the next iteration in the next event loop cycle
          await new Promise((resolve) => setImmediate(resolve));
        }
      }
    }
  }

  // Launch the next and any executor in parallel
  const n = next();
  const e = executors.map(ex => ex());
  await Promise.all([n, ...e]);

  return results;
}
```

> Any error thrown within the execution will be caught via the `catch` method of the returning promise.

Assuming we have the same list of tasks as before we can launch the execution like so.

```javascript
const tasks = [
  function tasks1 (input) {
    return new Promise((resolve, reject) => {...})
  },
  function tasks2 (input) {...},
  function tasks3 (input) {...},
  ...
];

// Launch the execution
execution(tasks, input, concurrency)
  .then((results) => {...})
  .catch((error) => {...});
```

## Considerations ##

### Race conditions ###

In parallel programming the most critical part is to keep consistency to the shared context between every task. Even though JavaScript engine implementations are single-threaded environments and there is not need to use techniques such as locks, mutexes and the like, the possibility of race conditions is **not guaranteed** to not happen. So you have to double check the computations taking place within a task running in parallel and the delay it takes to return its result to the others as this is often the reason of such race conditions.

## Implementations ##

Below you can find various trivial or real-world implementations of this pattern:

* [reducer](reducer.js): reduce random integer numbers in parallel with callbacks
* [limited-reducer](limited-reducer.js): reduce random integer numbers in parallel with promises