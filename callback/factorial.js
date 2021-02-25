function factorial (num, cb) {
  setTimeout(() => {
    try {
      if (num === 0) {
        return 1;
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
    throw error;
  }

  console.log(result); // 39916800
});