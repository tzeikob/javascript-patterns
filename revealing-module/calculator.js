var myNS = myNS || Object.create(null);

myNS.calculator = function calculator() {
  var result = 0;

  function reset(val) {
    result = val;
  }

  function add(val) {
    result += val;
    return result;
  }

  function subtract(val) {
    result -= val;
    return result;
  }

  function multiply(val) {
    result *= val;
    return result;
  }

  function divide(val) {
    result /= val;
    return result;
  }

  function sqrt() {
    result = Math.sqrt(result);
    return result;
  }

  function clear() {
    reset(0);
  }

  return {
    add,
    subtract,
    multiply,
    divide,
    sqrt,
    clear
  };
}();

var result = 0;

result = myNS.calculator.add(18);
result = myNS.calculator.subtract(9);
result = myNS.calculator.sqrt();
result = myNS.calculator.multiply(result);

console.log(result); // 9
