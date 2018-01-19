// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.module = function module() {
  // Here you can define the private internal state
  let x = 16;
  let y = 23;

  const methodD = function methodD() {
    return Math.min(x, y);
  }

  const methodA = function methodA() {
    return x;
  }

  const methodB = function methodB() {
    return y;
  }

  const methodC = function methodC() {
    let val = methodD();
    return Math.sqrt(val);
  }

  // Here you can reveal the public API
  return {
    methodA,
    methodB,
    methodC
  };
}();

myNS.module.methodC(); // 4
