function factorial (num, cb) {
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
  
      cb(null, result);
    } catch (error) {
      cb(error);
    }
  });
}

const result = factorial(11, (error, result) => {
  if (error) {
    console.error(error);
  } else {
    console.log(result); // 39916800
  }
});