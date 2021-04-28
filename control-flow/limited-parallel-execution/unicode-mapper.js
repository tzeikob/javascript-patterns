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
  let running = 0;
  let index = 0;
  let thrownError = null;

  const results = [];

  return new Promise((resolve, reject) => {
    function next () {
      while (running < concurrency && index < words.length) {
        const word = words[index];
        index++;

        toUnicode(word)
          .then((result) => {
            results.push(result);
          })
          .catch((error) => {
            thrownError = error;
          })
          .finally(() => {
            if (thrownError) {
              reject(thrownError);
            } else {
              if (results.length < words.length) {
                running--;
                next();
              } else {
                resolve(results);
              }
            }
          });

        running++;
      }
    }

    next();
  });
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