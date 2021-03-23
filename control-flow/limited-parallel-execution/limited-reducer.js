function reducer(tasks, input, concurrency) {
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return Promise.reject(new Error("Invalid tasks argument"));
  }

  if (!concurrency || concurrency <= 0) {
    return Promise.reject(new Error("Invalid concurrency argument"));
  }

  let running = 0;
  let index = 0;
  let thrownError = null;

  const output = { numbers: [], total: input };

  return new Promise((resolve, reject) => {
    function next() {
      while (running < concurrency && index < tasks.length) {
        const task = tasks[index];
        index++;

        task(input)
          .then((result) => {
            output.numbers.push(result);
            output.total += result;
          })
          .catch((error) => {
            thrownError = error;
          })
          .finally(() => {
            if (thrownError) {
              reject(thrownError);
            } else {
              if (output.numbers.length < tasks.length) {
                running--;
                next();
              } else {
                resolve(output);
              }
            }
          });

        running++;
      }
    }

    next();
  });
}

function rand(max) {
  return () => new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const result = Math.floor(Math.random() * max) + 1;

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  });
}

const tasks = [rand(2), rand(2), rand(2), rand(2), rand(2)];

reducer(tasks, 0, 3)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });

// Async output:
// { numbers: [ 1, 1, 1, 1, 1 ], total: 5 }