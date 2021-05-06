function toUnicode (word) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const unicode = word.split("").map((value) => {
          let temp = value.charCodeAt(0).toString(16).toUpperCase();

          if (temp.length > 2) {
            return `\\u${temp}`;
          }

          return value;
        }).join("");

        resolve(unicode);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
}

function mapWordsToUnicode (words, concurrency) {
  if (!words || !Array.isArray(words) || words.length === 0) {
    return Promise.reject(new Error("Invalid words argument"));
  }

  if (!concurrency || typeof concurrency !== "number" || concurrency <= 0) {
    return Promise.reject(new Error("Invalid concurrency argument"));
  }

  const results = [];

  function executor () {
    return new Promise((resolve, reject) => {
      function loop () {
        if (words.length === 0) {
          return resolve();
        }

        const word = words.shift();

        toUnicode(word)
          .then((result) => results.push(result))
          .then(loop)
          .catch(reject);
      }
      
      loop();
    });
  }

  const executors = [];

  for (let i = 0; i < concurrency; i++) {
    executors[i] = executor();
  }

  const promise = Promise.all(executors).then(() => results);

  return promise;
}

const words = [
  "コード",
  "コンピューター",
  "ロボット",
  "エラー",
  "キーボード",
  "コンソール"
];

mapWordsToUnicode(words, 3)
  .then((results) => console.log(results))
  .catch((error) => console.error(error));

// Async output:
// [
//   '\\u30B3\\u30FC\\u30C9',
//   '\\u30B3\\u30F3\\u30D4\\u30E5\\u30FC\\u30BF\\u30FC',
//   '\\u30ED\\u30DC\\u30C3\\u30C8',
//   '\\u30A8\\u30E9\\u30FC',
//   '\\u30AD\\u30FC\\u30DC\\u30FC\\u30C9',
//   '\\u30B3\\u30F3\\u30BD\\u30FC\\u30EB'
// ]