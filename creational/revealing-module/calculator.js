var myNS = myNS || Object.create(null);

myNS.calculator = function calculator() {
  let result = 0;

  const reset = function reset(val) {
    result = val;
  };

  const add = function add(val) {
    result += val;
    return result;
  };

  const subtract = function subtract(val) {
    result -= val;
    return result;
  };

  const multiply = function multiply(val) {
    result *= val;
    return result;
  };

  const divide = function divide(val) {
    result /= val;
    return result;
  };

  const sqrt = function sqrt() {
    result = Math.sqrt(result);
    return result;
  };

  const clear = function clear() {
    reset(0);
  };

  return {
    add,
    subtract,
    multiply,
    divide,
    sqrt,
    clear
  };
}();

let result = 0;

result = myNS.calculator.add(18);
result = myNS.calculator.subtract(9);
result = myNS.calculator.sqrt();
result = myNS.calculator.multiply(result);

console.log(result); // 9
