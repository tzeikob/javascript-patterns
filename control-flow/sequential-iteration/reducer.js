function rand (max) {
  return (cb) => {
    setTimeout(() => {
      try {
        const number = Math.floor(Math.random() * max) + 1;

        cb(null, number);
      } catch (error) {
        cb(error);
      }
    });
  }
}

function reduce (tasks, cb) {
  const context = { numbers: [], value: 0 };

  function iterate (index) {
    if (index === tasks.length) {
      return setTimeout(() => cb(null, context));
    }

    const task = tasks[index];
    
    task((error, result) => {
      if (error) {
        return cb(error);
      }

      context.numbers.push(result);
      context.value += result;

      iterate(index + 1);
    });
  }

  iterate(0);
}

const tasks = [rand(2), rand(4), rand(6)];

reduce(tasks, (error, result) => {
  if (error) {
    return console.error(error);
  }

  console.log(result);
});

// Async random output:
// { numbers: [ 1, 4, 3 ], value: 8 }