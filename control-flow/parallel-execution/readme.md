# The Parallel Execution Pattern

The parallel execution pattern belongs to the category of those design patterns called **async control flow** patterns. In use cases where we don't need to execute asynchronous tasks in sequential order one after the other, we can spawn the execution of each task in **parallel** and wait to be notified when all of them are done. By convention when we are referring to a parallel execution we actually mean that the tasks are executed concurrently, which is a more accurate term.

## Explanation

The execution of such pattern should be considered as completed when all given tasks have been completed, unless a task throws an error which means that the execution should be rejected along with the thrown error. This pattern can be implemented using either old school **callbacks** or the more development friendly **promises** and **async functions**, where either implementation should give us the same execution.

### Parallel execution with callbacks

Let's say we have an `execution` function expecting a collection of asynchronous via callback `tasks` along with the completion `callback`. This function's responsibility is to handle the invocation of each task in parallel and to achieve that we are about to use two variables to store the state of the execution at any given time. One variable called `completed` to count the number of completed tasks and another one called `rejected` which is a boolean indicating that a task has already thrown an error and the execution should be considered as rejected.

```javascript
function execution (tasks, callback) {
  let completed = 0; // Total completed tasks
  let rejected = false; // Indicate if another task thrown an error

  const results = []; // Store the result of each task
}
```

> The result of each task is collected via closure into the `results` variable.

Now since this function invokes all the tasks at once we have to control somehow the completion or rejection of the execution. We can do this by using a helper function called `done` which will be passed as the callback to each task at invocation, that's it, the `callback` of each task is that same function. When a task completes either rejected or fulfilled this function is called back along with the `error` or the `result` respectively. Within the code of this function we are checking if the task has thrown an error and if such we mark the execution as rejected and return early. Otherwise we count up another completion, collect the result and check if this task was the last one in order to call the completion callback along with the list of collected results.

```javascript
function execution (tasks, callback) {
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

    completed++; // Count another completed task
    results.push(result); // Store the task's completion result

    // Call back once in completion
    if (completed === tasks.length && !rejected) {
      callback(null, results);
    }
  }

  // Spawn all tasks with the done as callback
  tasks.forEach(task => task(done));
}
```

> Bear in mind that the completion callback should always be called **once** either at rejection or completion along with the error or the result respectively.

Now let's put all this together.

```javascript
function execution (tasks, callback) {
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
  tasks.forEach(task => task(done));
}
```

Having a collection of tasks is now easy to execute them in parallel.

```javascript
// A collection of trivially implemented asynchronous tasks
const tasks = [
  (callback) => setTimeout(() => callback(null, "Task1")),
  (callback) => setTimeout(() => callback(null, "Task2")),
  (callback) => setTimeout(() => callback(null, "Task3"))
];

execution(tasks, (error, results) => {
  if (error) {
    return console.error(error);
  }

  console.log(results);
});
```

> Note that we don't take special care here, but in real-world it's reasonable to store the results in the order each task has been given.

On thing to keep in mind is that, which one of the tasks will call the completion callback is subject to a situation called **competitive race**, once this callback called the execution should be considered as completed.

### Parallel execution with promises

Implementing this pattern with **promises** is way easier than using asynchronous callbacks and on top of that we will get a more readable and less complex code base. In this implementation each task is expected to return a promise instead of using a callback to complete. The only thing we should do in order to execute all the tasks in parallel is to invoke them and pass their promises as an array of promises in the built-in `Promise.all` method. This method returns another promise on which we will set our completion and rejection handlers. Keep in mind that this method fulfills only if all of the given promises are fulfilled, if any of them rejects the whole execution is considered as rejected. Assuming we have a collection of asynchronous `tasks` this is how we execute them in parallel.

```javascript
// A collection of trivially implemented asynchronous tasks
const tasks = [
  () => new Promise((resolve) => setTimeout(() => resolve("Task1"))),
  () => new Promise((resolve) => setTimeout(() => resolve("Task2"))),
  () => new Promise((resolve) => setTimeout(() => resolve("Task3")))
];

// Launch each task in parallel
const promises = tasks.map(task => task()); // Map task into a promise

// Handle the completion or rejection
Promise.all(promises)
  .then((results) => {
    console.log(results);
  })
  .catch((error) => {
    console.error(error);
  });
```

> Note we skip any promise rejection within asynchronous tasks for brevity, but you always have to take care of rejections.

### Parallel execution with async/await

Implementing the parallel execution pattern with **async/await** is not enormously different than using promises, we only need to use an async function along with the `Promise.all` method and we are pretty much done. Within the async function `execution` we pass the collection of `tasks`. The first thing to do is to launch each task in parallel by mapping each task into its promise. Having the collection of promises we can now wait for them to complete. Finally we return the collection of the results back to the caller of the execution, which is expected to be another promise.

```javascript
async function execution (tasks) {
  // Launch each task in parallel
  const promises = tasks.map((task) => task());

  // Wait for the results
  const results = await Promise.all(promises);

  return results;
}
```

> Any rejection occurred by a task will cause the execution to reject as well.

Having the collection of tasks we can invoke the execution like so.

```javascript
// A collection of trivially implemented asynchronous tasks
const tasks = [
  () => new Promise((resolve) => setTimeout(() => resolve("Task1"))),
  () => new Promise((resolve) => setTimeout(() => resolve("Task2"))),
  () => new Promise((resolve) => setTimeout(() => resolve("Task3")))
];

execution(tasks)
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

## Implementations

Below you can find various trivial or real-world implementations of this pattern:

* [Stop Words](stop-words.js): Find how many stop words a given list of words has with callbacks
* [Unicode Mapper](unicode-mapper.js): Map japanese words to their unicode equivalent with promises
* [Sales](sales.js): Reduce to the total amount of sales from different sources with async/await