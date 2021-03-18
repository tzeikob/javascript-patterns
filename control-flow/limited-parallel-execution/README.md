# The Limited Parallel Execution Pattern #

The **limited parallel execution** pattern belongs to the category of those design patterns called **async control flow** patterns and is a special version of the [parallel execution](../parallel-execution/README.md) pattern. In use cases where we have limited number of resources (memory, cpu cycles) we should consider taking another approach by just invoking all tasks at once. Instead we can split the execution in batches of tasks run in **parallel** and wait to be notified when all of them are done.

## Explanation ##

In a such a parallel execution context we should take special care to handle the execution by following two important rules, in case an error is thrown the completion callback should be called **once** given that error and the execution shall be considered as rejected. On the other hand in the case all tasks are completed successfully, the completion callback should be called **once** along with any collected results.

Assume we have an `execution` function which expects a collection of asynchronous `tasks` along with an `input`, the `concurrency` limit and the `completion callback`. The concurrency limit is the maximum number of tasks which can be running in parallel at any given time in execution. Along with the already known `completed` and `rejected` variables which are used in the parallel execution pattern, here we have two more variables. The variable `running` responsible to keep the actual number of running tasks at any given time and an `index` to point to the next task in invocation.

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

> The result of each task is collected in the shared via closure variable called `results`.

The execution starts by calling a helper function `next` which via indirect recursion is handling which task is about to be pushed in the parallel execution by keeping at the same time the limit of concurrency. As long as the there is room for another task to be executed and there are still tasks not spawn, we invoke the next in order task. Now as you can see here we have the same `done` helper function we've used in parallel execution pattern. This function is passed as callback to each task's invocation, but here has a slightly different behavior. When a task calls the done function at completion or rejection we have to count down the `running` variable in order to inform the execution that a task is finished and there is now room for another task to take action. Having a collection of tasks is now easy to execute them in parallel.

```javascript
// A collection of asynchronous tasks
const tasks = [
  function task1 (input, callback) {...},
  function task2 (input, callback) {...},
  function task3 (input, callback) {...},
  ...
];

// Launch the execution
execution(tasks, input, concurrency, (error, results) => {
  if (error) {
    return console.error(error);
  }

  console.log(results);
});
```

We can thought the limited parallel execution as a room within tasks can be run in parallel, but the space is bounded to accept only a limited number of tasks. Every time a task in the room completes another task from the collection drops in and starts executing. The goal is to split the overhead of running too many tasks in parallel and avoid running out of resources.

## Considerations ##

### Race conditions ###

In parallel programming the most critical part is to keep consistency to the shared context between every task. Event though JavaScript engine implementations are single-threaded environments and there is not need to use techniques such as locks, mutexes and the like, the possibility of race conditions is **not guaranteed** to not happen. So you have to double check the computations taking place within a task running in parallel and the delay it takes to return its result to the others as this is often the reason of such race conditions.

## Implementations ##

Below you can find various trivial or real-world implementations of this pattern:

* [reducer.js](reducer.js): reduce random integer numbers in parallel with batches