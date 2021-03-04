var myNS = myNS || Object.create(null);

myNS.fibonacci = function fibonacci() {
  const cache = {};

  const method = function method(n) {
    if (n in cache) {
      return cache[n];
    }

    let result;

    if (n <= 1) {
      result = 1;
    } else {
      result = method(n - 1) + method(n - 2);
    }

    cache[n] = result;

    return result;
  };

  return method;
}();

myNS.fibonacci(888); // 2.757574028084329e+185
myNS.fibonacci(888); // 2.757574028084329e+185
myNS.fibonacci(888); // 2.757574028084329e+185
