function reducer(tasks, input, concurrency, cb) {
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return setTimeout(() => cb(new Error("Invalid tasks argument")));
  }

  if (!concurrency || concurrency <= 0) {
    return setTimeout(() => cb(new Error("Invalid concurrency argument")));
  }

  let completed = 0;
  let rejected = false;
  let running = 0;
  let index = 0;

  const output = { numbers: [], total: input };

  function done(error, result) {
    if (error) {
      if (rejected) {
        return;
      }

      rejected = true;
      cb(error);
    }

    completed++;
    output.numbers.push(result);
    output.total += result;

    if (completed === tasks.length && !rejected) {
      cb(null, output);
    }

    running--;
    next();
  }

  function next() {
    while (running < concurrency && index < tasks.length) {
      const task = tasks[index];
      index++;
      
      task(done);

      running++;
    }
  }

  next();
}

function rand(max) {
  return (cb) => {
    setTimeout(() => {
      try {
        const result = Math.floor(Math.random() * max) + 1;

        cb(null, result);
      } catch (error) {
        cb(error);
      }
    });
  }
}

const tasks = [rand(2), rand(2), rand(2), rand(2), rand(2)];

reducer(tasks, 0, 3, (error, result) => {
  if (error) {
    return console.error(error);
  }

  console.log(result);
});

// Async output:
// { numbers: [ 1, 2, 2, 2, 1 ], total: 8 }