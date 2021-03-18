# The Parallel Execution Pattern #

The **parallel execution** pattern belongs to the category of those design patterns called **async control flow** patterns. In use cases where we don't need to execute asynchronous tasks in sequential order one after the other, we can spawn the execution of each task in **parallel** and wait to be notified when all of them are done. By convention when we are referring to a parallel execution we actually mean that the tasks are executed concurrently, which is a more accurate term.

## Explanation ##

In a such a parallel execution context we should take special care to handle the execution by following two important rules, in case an error is thrown the completion callback should be called **once** given that error and the execution shall be considered as rejected. On the other hand in the case all tasks are completed successfully, the completion callback should be called **once** along with any collected results.

Let's say we have an `execution` function expecting a collection of asynchronous `tasks` along with an `input` and the `completion callback`. This function's responsibility is to handle the invocation of each task in parallel and to achieve that we're using two variables in order to keep the state of the execution at any given time, one variable called `completed` to count the number of completed tasks and another one called `rejected` which is a boolean indicating that a task has already thrown an error and the execution should be considered canceled.

```javascript
function execution (tasks, input, callback) {
  let completed = 0; // Total completed tasks
  let rejected = false; // Indicate if another task thrown an error

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

    completed++; // Count another completed task
    results.push(result); // Store the task's completion result

    // Call back once in completion
    if (completed === tasks.length && !rejected) {
      callback(null, results);
    }
  }

  // Spawn all tasks with the done as callback
  tasks.forEach(task => task(input, done));
}
```

> The result of each task is collected in the shared via closure variable called `results`.

Now since this function invokes all the tasks at once we have to control somehow the completion or rejection of the execution. We can do this by using a helper function called `done` which will be passed as the callback to each task at invocation, that's it the `callback` of each task is this same function. When a task completes either rejected or fulfilled this function is called back along with the `error` or the `result`. Within the code of this function we are checking if the task thrown an error and if such we mark the execution as rejected and return early with the error, otherwise we count up another completion, collect the result and check if this task was the last one in order to call back along with the list of collected results. Having a collection of tasks is now easy to execute them in parallel.

```javascript
// A collection of asynchronous tasks
const tasks = [
  function task1 (input, callback) {...},
  function task2 (input, callback) {...},
  function task3 (input, callback) {...},
  ...
];

// Launch the execution
execution(tasks, input, (error, results) => {
  if (error) {
    return console.error(error);
  }

  console.log(results);
});
```

> Note that we don't take special care here, but in real-world it's reasonable to store the results in the order each task has been given.

On thing to keep in mind is that, which one of the tasks will call back the completion callback is subject to a situation called **competitive race**, once this callback called the execution should be considered as completed.

## Considerations ##

### Race conditions ###

In parallel programming the most critical part is to keep consistency to the shared context between every task. Event though JavaScript engine implementations are single-threaded environments and there is not need to use techniques such as locks, mutexes and the like, the possibility of race conditions is **not guaranteed** to not happen. So you have to double check the computations taking place within a task running in parallel and the delay it takes to return its result to the others as this is often the reason of such race conditions.

## Implementations ##

Below you can find various trivial or real-world implementations of this pattern:

* [reducer](reducer.js): reduce random integer numbers in parallel