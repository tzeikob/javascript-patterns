function factorial (num, callback) {
  setTimeout(() => {
    try {
      if (typeof num !== "number") {
        throw new Error("Number must be an integer value");
      }
    
      if (num < 0) {
        throw new Error("Number must be a non-negative integer value");
      }

      let result = 1;

      for (let i = 1; i <= num; i++) {
        result *= i;
      }
  
      callback(null, result);
    } catch (error) {
      callback(error);
    }
  });
}

factorial(11, (error, result) => {
  if (error) {
    return console.error(error);
  }

  console.log(result);
});

// Async output:
// 39916800