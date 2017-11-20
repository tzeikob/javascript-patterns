var myNS = myNS || Object.create(null);

myNS.calculator = function calculator() {
  var result = 0;

  function reset(val) {
    result = val;
  }

  return {
    add: function add(val) {
      result += val;
      return result;
    },
    subtract: function subtract(val) {
      result -= val;
      return result;
    },
    multiply: function multiply(val) {
      result *= val;
      return result;
    },
    divide: function divide(val) {
      result /= val;
      return result;
    },
    sqrt: function sqrt() {
      result = Math.sqrt(result);
      return result;
    },
    clear: function clear() {
      reset(0);
    }
  };
}();

var result = 0;

result = myNS.calculator.add(18);
result = myNS.calculator.subtract(9);
result = myNS.calculator.sqrt();
result = myNS.calculator.multiply(result);

console.log(result); // 9
