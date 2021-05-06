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

function countStopWords (words, concurrency, callback) {
  if (!words || !Array.isArray(words) || words.length === 0) {
    return setTimeout(() => callback(new Error("Invalid words argument")));
  }

  if (!concurrency || typeof concurrency !== "number" || concurrency <= 0) {
    return setTimeout(() => callback(new Error("Invalid concurrency argument")));
  }

  let completed = 0;
  let rejected = false;

  let running = 0;
  let index = 0;

  let result = 0;

  function done (error, isStopWord) {
    if (error) {
      if (rejected) {
        return;
      }

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

    running--;
    next();
  }

  function next () {
    while (running < concurrency && index < words.length) {
      const word = words[index];
      index++;

      isStopWord(word, done);

      running++;
    }
  }

  next();
}

const words = ["this", "code", "is", "sexy", "as", "hell"];

countStopWords(words, 3, (error, result) => {
  if (error) {
    return console.error(error);
  }

  console.log(result);
});

// Async output:
// 2