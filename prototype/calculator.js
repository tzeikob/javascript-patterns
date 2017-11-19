function Calculator() {
  this.result = 0;
}

Calculator.prototype.add = function(val) {
  this.result += val;
  return this.result;
};

Calculator.prototype.subtract = function(val) {
  this.result -= val;
  return this.result;
};

Calculator.prototype.multiply = function(val) {
  this.result *= val;
  return this.result;
};

Calculator.prototype.divide = function(val) {
  this.result /= val;
  return this.result;
};

Calculator.prototype.sqrt = function() {
  this.result = Math.sqrt(this.result);
  return this.result;
};

Calculator.prototype.clear = function() {
  this.result = 0;
};

let calc = new Calculator();

calc.add(18);
calc.subtract(9);
calc.sqrt();
calc.multiply(calc.result);

console.log(calc.result); // 9
