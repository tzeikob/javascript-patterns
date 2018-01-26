var myNS = myNS || Object.create(null);

myNS.Calculator = function Calculator() {
  this.result = 0;
}

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

myNS.BetaCalculator = function BetaCalculator() {
  myNS.Calculator.call(this);
};

myNS.BetaCalculator.prototype = Object.create(myNS.Calculator.prototype);

myNS.BetaCalculator.prototype.log = function log() {
  this.result = Math.log(this.result);
  return this.result;
};

let calc = new myNS.BetaCalculator();

calc.add(18);
calc.subtract(9);
calc.sqrt();
calc.multiply(calc.result);
calc.log();

console.log(calc.result); // 2.1972245773362196
