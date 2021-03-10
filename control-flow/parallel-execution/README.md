# The Parallel Execution Pattern #

The **parallel execution** pattern belongs to the category of those design patterns called **async control flow** patterns. Apart from the sequential execution there are cases in which we don't need tasks to be executed in a strict order in a flow of one after the other. So we can spawn the execution of task in a **parallel** manner, better called **concurrent**, and wait to be notified when all of them are done.

## Explanation ##

In a such a parallel execution context we should take special care to handle the execution by following two important rules, in case an error is thrown the completion callback should be called **once** given that error, on the other hand in the case of all tasks are completed the completion callback should be called **once** along with any collected results.

### Unlimited parallel execution ###

One use case of this pattern is the **unlimited parallel execution**, where we have a collection of asynchronous tasks invoked all at once waiting for all of them to complete by counting every time the callback of a task is invoked.

In order to achieve this we can make use of a function, called **done** by convention, which should be bound around a **closure** of various utility variables, which help us to handle the flow of the execution. Let's say we have an asynchronous task given a input context along with a callback function, that function is expected to be the done function.

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

> We are using the `setTimeout` method in order to mimic the asynchronous execution of a task.

Now assume we have a function expecting a collection of such asynchronous tasks meant to be executed in a parallel way, this function's responsibility is to declare a couple of variables which will be shared via a closure to each task's scope in the execution. That's it, we want any tasks to have access to those variables and we'll achieve this via the done function passed to each task as a callback.

In the simplest implementation we'll only need two variables, one to watch the total completed tasks and another one to check if a rejection error has been thrown. Now, within the done function we should read each one of those variables and decide what to do. By convention when a task calls the done function with an error we should return early calling the completion callback, if many tasks thrown an error as well the first one wins. In the other case where every task completes the last one should call the completion callback along with any collected results.

```javascript
function operation (tasks, input, callback) {
  let completed = 0; // Total completed tasks
  let rejected = false; // Indicate if a task thrown an error

  const results = [];

  function done (error, result) {
    if (error) {
      if (rejected) {
        return; // Don't call back if execution rejected by another task
      }

      // Inform all tasks about rejection and call back early
      rejected = true;
      return callback(error);
    }

    completed++; // Count another completed task
    results.push(result); // Store the task's completion result

    // Call back once in completion
    if (completed === tasks.length && !rejected) {
      callback(null, results);
    }
  }

  // Spawn every task in parallel given the done function
  tasks.forEach(task => task(input, done));
}

// Launch the execution
operation(tasks, input, (error, results) => {
  ...
});
```

> Note that we don't take special care here, to store the results in the order each task has been given.

Which one of the tasks will call back the completion callback is subject to a situation called **competitive race**, once this callback called the execution should be considered as completed.

### Limited parallel execution ###

Another use case is the **limited parallel execution**, where given a collection of asynchronous tasks instead of invoking all them at once we start by spawning a limited number of tasks in parallel and keep invoking more tasks as soon as there is left room in the execution by any previous completed task.

How many tasks can running in parallel is restricted by the limit of concurrency, so we need a variable to store the maximum number of tasks should run in parallel along with another variable responsible to keep the actual number of running tasks at any given time and an index to mark the next task to be invoked. Then we should make sure that the total number of running tasks are below that limit and at the same time checking if any error is thrown or the total number of tasks are completed. Along with the **done** function here, we will need another function called **next** which both should be responsible to handle the invocation of the next tasks in limited batches.

```javascript
function operation (tasks, input, concurrency, callback) {
  let completed = 0; // Total completed tasks
  let rejected = false; // Indicate if a task thrown an error

  let running = 0; // Total running tasks
  let index = 0; // Index of the next task to invoke

  const results = [];

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
      // Get the task to invoke and mark the next one
      const task = tasks[index];
      index++;

      task(input, done); // Invoke the task

      running++; // Mark that a spot is occupied in concurrency
    }
  }

  next(); // Launch iteration
}

// Launch the operation
operation(tasks, input, concurrency, (error, results) => {
  ...
});
```

We can see this pattern as a combination of an iterative process of parallel tasks running in batches, where the goal is to split the overhead of running too many tasks in parallel and avoid running out of resources.

## Implementations ##

Below you can find various trivial or real-world implementations of this pattern:

* [reducer](reducer.js): a trivial example of an unlimited parallel reducer of random integer numbers
* [limited-reducer.js](limited-reducer.js): a trivial example of a limited parallel reducer of random integer numbers

## Considerations ##

### Race conditions ###

In parallel programming the most critical part is to keep consistency to the shared context between every task. Event though JavaScript engine implementations are single-threaded environments and there is not need to use techniques such as locks, mutexes and the like, the possibility of race conditions is **not guaranteed** to not happen. So you have to double check the computations taking place within a task running in parallel and the delay it takes to return its result to the others as this is often the reason of such race conditions.