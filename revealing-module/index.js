// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.module = function module() {
  // Here you can define the private internal state
  var x = 16;
  var y = 23;

  function methodD() {
    return Math.min(x, y);
  }

  function methodA() {
    return x;
  }

  function methodB() {
    return y;
  }

  function methodC() {
    var val = methodD();
    return Math.sqrt(val);
  }

  // Here you can reveal the public API
  return {
    methodA,
    methodB,
    methodC
  };
}();

var sqrt = myNS.module.methodC();
console.log(sqrt); // 4
