import { isLatin, isNonStopWord, isNotNumber } from "text-ai";

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

function exclude (items, filters) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return Promise.reject(new Error("Invalid items argument"));
  }

  if (!filters || !Array.isArray(filters) || filters.length === 0) {
    return Promise.reject(new Error("Invalid filters argument"));
  }

  items = Promise.resolve(items);

  const promise = filters.reduce((previous, filter) => {
    return previous.then(filter);
  }, items);

  return promise;
}

const words = ["code", "the", "world", "εντολή", "44"];

const filters = [filter(isLatin), filter(isNonStopWord), filter(isNotNumber)];

exclude(words, filters)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });

// Async output:
// ["code", "world"]