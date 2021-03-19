function reducer (tasks, input, cb) {
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return cb(new Error("Invalid tasks argument"));
  }

  let completed = 0;
  let rejected = false;

  let output = { numbers: [], total: input };

  function done (error, result) {
    if (error) {
      if (rejected) {
        return;
      }

      rejected = true;
      return cb(error);
    }

    completed++;
    output.numbers.push(result);
    output.total += result;

    if (completed === tasks.length && !rejected) {
      cb(null, output);
    }
  }

  tasks.forEach(task => task(done));
}

function rand (max) {
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

const tasks = [rand(2), rand(4), rand(6)];

reducer(tasks, 0, (error, result) => {
  if (error) {
    return console.error(error);
  }

  console.log(result);
});

// Async random output:
// { numbers: [ 1, 4, 3 ], total: 8 }