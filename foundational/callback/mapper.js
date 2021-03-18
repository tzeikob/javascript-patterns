function map (values, cb) {
  const mapped = [];

  for (let i = 0; i < values.length; i++) {
    mapped.push(cb(values[i]));
  }

  return mapped;
}

const values = [1, 2, 3, 4, 5];

const mapped = map(values, (value) => value * 2);

console.log(mapped); // [2, 4, 6, 8, 10]