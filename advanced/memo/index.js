// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.memo = function memo() {
  // Create a place to cache each calculation
  const cache = {};

  // Create a closure to have access to the cache
  const method = function method(n) {
    // Check if the call is cached before
    if (n in cache) {
      return cache[n];
    }

    let result = n * n;

    // Cache the result for future uses
    cache[n] = result;

    return result;
  };

  return method;
}();

myNS.memo(88); // 7744
myNS.memo(88); // 7744
myNS.memo(88); // 7744
