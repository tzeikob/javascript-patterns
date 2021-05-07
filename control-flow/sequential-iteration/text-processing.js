import { removeStopWords, toLoweCase, removePunctuations, split } from "text-ai";

function process (input, processors, callback) {
  if (!input || typeof input !== "string") {
    return setTimeout(() => callback(new Error("Invalid input argument")));
  }

  if (!processors || !Array.isArray(processors) || processors.length === 0) {
    return setTimeout(() => callback(new Error("Invalid processors argument")));
  }

  function iterate (index) {
    if (index === processors.length) {
      return callback(null, input);
    }

    const processor = processors[index];
    
    processor(input, (error, output) => {
      if (error) {
        return callback(error);
      }

      input = output;

      iterate(index + 1);
    });
  }

  iterate(0);
}

const processors = [removeStopWords, removePunctuations, toLoweCase, split];

process("The world of coding is amazing!", processors, (error, result) => {
  if (error) {
    return console.error(error);
  }

  console.log(result);
});

// Async output:
// ["world", "coding", "is", "amazing"]