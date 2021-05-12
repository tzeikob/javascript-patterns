function isStopWord (word, callback) {
  const stopWords = ["and", "the", "at", "on", "as", "by", "this"];

  setTimeout(() => {
    try {
      callback(null, stopWords.includes(word));
    } catch (error) {
      callback(error);
    }
  }, 1000);
}

function countStopWords (words, callback) {
  if (!words || !Array.isArray(words) || words.length === 0) {
    return setTimeout(() => cb(new Error("Invalid words argument")));
  }

  let completed = 0;
  let rejected = false;

  let result = 0;

  function done (error, isStopWord) {
    if (rejected) {
      return;
    }

    if (error) {
      rejected = true;
      return callback(error);
    }

    completed++;

    if (isStopWord) {
      result += 1;
    }

    if (completed === words.length && !rejected) {
      callback(null, result);
    }
  }

  words.forEach(word => isStopWord(word, done));
}

const words = ["this", "code", "is", "sexy", "as", "hell"];

countStopWords(words, (error, result) => {
  if (error) {
    return console.error(error);
  }

  console.log(result);
});

// Async output:
// 2