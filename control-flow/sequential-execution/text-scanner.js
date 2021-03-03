function scanText(context, cb) {
  countChars(context, cb);
}

function countChars (context, cb) {
  setTimeout(() => {
    try {
      const onlyChars = context.text.replace(/\s+/g, "");

      context.chars = onlyChars.length;

      countWords(context, cb);
    } catch (error) {
      cb(error);
    }
  });
}

function countWords (context, cb) {
  setTimeout(() => {
    try {
      const words = context.text.trim().split(/\s+/g);

      context.words = words.length;

      countSpaces(context, cb);
    } catch (error) {
      cb(error);
    }
  });
}

function countSpaces (context, cb) {
  setTimeout(() => {
    try {
      const spaces = context.text.trim().split(/\s+/g);

      context.spaces = spaces.length - 1;

      cb(null, context);
    } catch (error) {
      cb(error);
    }
  });
}

const context = { text: "Hello JavaScript World" };

scanText(context, (error, result) => {
  if (error) {
    return console.error(error);
  }

  console.log(`Result: { chars: ${result.chars}, words: ${result.words}, spaces: ${result.spaces} }`);
});

// Async output:
// Result: { chars: 20, words: 3, spaces: 2 }