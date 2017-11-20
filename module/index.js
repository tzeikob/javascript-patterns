// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.module = function() {
  // Here you can define the private internal state
  var x = 16;
  var y = 23;

  function methodD() {
    return Math.min(x, y);
  }

  // Here you can return the public API
  return {
    methodA: function() {
      return x;
    },
    methodB: function() {
      return y;
    },
    methodC: function() {
      var val = methodD();
      return Math.sqrt(val);
    }
  };
}();

var sqrt = myNS.module.methodC();
console.log(sqrt); // 4
