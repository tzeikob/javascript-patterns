import fs from "fs";
import bcrypt from "bcrypt";

function execution (tasks, input, cb) {
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return cb(new Error("Invalid tasks argument"));
  }

  let value;

  function iterate (index) {
    if (index === tasks.length) {
      return cb(null, value);
    }
    
    const task = tasks[index];

    task(input, (error, result) => {
      if (error) {
        return cb(error);
      }

      input = result;
      value = result;

      iterate(index + 1);
    });
  }

  iterate(0);
}

const tasks = [
  function readFile (input, cb) {
    fs.readFile(input.filename, (error, content) => {
      if (error) {
        return cb(error);
      }
  
      input.content = content;
  
      cb(null, input);
    });
  },

  function encrypt (input, cb) {
    bcrypt.hash(input.content, 10, (error, hash) => {
      if (error) {
        return cb(error);
      }
  
      input.hash = hash;
  
      cb(null, input);
    });
  },
  
  function writeFile (input, cb) {
    fs.writeFile(input.filename + ".bin", input.hash, (error) => {
      if (error) {
        return cb(error);
      }
  
      cb(null, true);
    });
  }
];

execution(tasks, { filename: "data.json" }, (error, result) => {
  if (error) {
    return console.error(error);
  }

  console.log(result);
});

// Async output:
// true