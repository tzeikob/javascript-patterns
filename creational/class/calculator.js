var myNS = myNS || Object.create(null);

myNS.Calculator = class Calculator {
  constructor() {
    this.result = 0;
  }

  add(val) {
    this.result += val;
    return this.result;
  }

  subtract(val) {
    this.result -= val;
    return this.result;
  }

  multiply(val) {
    this.result *= val;
    return this.result;
  }

  divide(val) {
    this.result /= val;
    return this.result;
  }

  sqrt() {
    this.result = Math.sqrt(this.result);
    return this.result;
  }

  clear() {
    this.result = 0;
  }
}

let calc = new myNS.Calculator();

calc.add(18);
calc.subtract(9);
calc.sqrt();
calc.multiply(calc.result);

console.log(calc.result); // 9
