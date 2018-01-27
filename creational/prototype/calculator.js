var myNS = myNS || Object.create(null);

myNS.Calculator = function Calculator() {
  this.result = 0;
};

myNS.Calculator.prototype.add = function add(val) {
  this.result += val;
  return this.result;
};

myNS.Calculator.prototype.subtract = function subtract(val) {
  this.result -= val;
  return this.result;
};

myNS.Calculator.prototype.multiply = function multiply(val) {
  this.result *= val;
  return this.result;
};

myNS.Calculator.prototype.divide = function divide(val) {
  this.result /= val;
  return this.result;
};

myNS.Calculator.prototype.sqrt = function sqrt() {
  this.result = Math.sqrt(this.result);
  return this.result;
};

myNS.Calculator.prototype.clear = function clear() {
  this.result = 0;
};

let calc = new myNS.Calculator();

calc.add(18);
calc.subtract(9);
calc.sqrt();
calc.multiply(calc.result);

console.log(calc.result); // 9
