function rand (max) {
  return (cb) => {
    setTimeout(() => {
      try {
        const result = Math.floor(Math.random() * max) + 1;

        cb(null, result);
      } catch (error) {
        cb(error);
      }
    }, max * 1000);
  }
}

function reducer (tasks, input, concurrency, cb) {
  let completed = 0;
  let rejected = false;
  let running = 0;
  let index = 0;

  const context = { numbers: [], total: input };

  function done (error, result) {
    if (error) {
      if (rejected) {
        return;
      }

      rejected = true;
      cb(error);
    }

    completed++;
    context.numbers.push(result);
    context.total += result;

    if (completed === tasks.length && !rejected) {
      cb(null, context);
    }

    running--;
    next();
  }

  function next () {
    while (running < concurrency && index < tasks.length) {
      const task = tasks[index];
      index++;
      task(done);

      running++;
    }
  }

  next();
}

const tasks = [rand(2), rand(2), rand(2), rand(2), rand(2)];

reducer(tasks, 0, 3, (error, result) => {
  if (error) {
    return console.error(error);
  }

  console.log(result);
});

// Async random output:
// { numbers: [ 1, 2, 2, 2, 1 ], total: 8 }