function reduce (tasks, cb) {
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return cb(new Error("Invalid tasks argument"));
  }

  const output = { numbers: [], value: 0 };

  function iterate (index) {
    if (index === tasks.length) {
      return cb(null, output);
    }

    const task = tasks[index];
    
    task((error, result) => {
      if (error) {
        return cb(error);
      }

      output.numbers.push(result);
      output.value += result;

      iterate(index + 1);
    });
  }

  iterate(0);
}

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

const tasks = [rand(2), rand(4), rand(6)];

reduce(tasks, (error, result) => {
  if (error) {
    return console.error(error);
  }

  console.log(result);
});

// Async output:
// { numbers: [ 1, 4, 3 ], value: 8 }