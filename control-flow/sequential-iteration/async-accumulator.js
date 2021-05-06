async function execution (tasks, input) {
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    throw new Error("Invalid tasks argument");
  }

  let result;

  for (const task of tasks) {
    result = await task(input);

    input = result;
  }

  return result;
}

function rand (size, max) {
  return () => new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const numbers = [];

        for (let i = 0; i < size; i++) {
          numbers.push(Math.floor(Math.random() * max) + 1);
        }

        resolve(numbers);
      } catch (error) {
        reject(error);
      }
    });
  });
}

function filter (criterion) {
  return (values) => new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const filtered = values.filter(criterion);

        resolve(filtered);
      } catch (error) {
        reject(error);
      }
    });
  });
}

function reducer () {
  return (values) => new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const total = values.reduce((total, value) => total + value, 0);

        resolve(total);
      } catch (error) {
        reject(error);
      }
    });
  });
}

const tasks = [
  rand(20, 10),
  filter(value => value % 2 === 0),
  filter(value => value > 5),
  reducer()
];

execution(tasks)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

// Async output:
// 32