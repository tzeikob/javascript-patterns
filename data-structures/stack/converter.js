const Stack = require('./stack');

class Converter {

  constructor(base = 2) {
    this.base = base;
    this.digits = '0123456789ABCDEF';
  }

  parse(num) {
    let stack = new Stack();

    while(num > 0) {
      let rem = Math.floor(num % this.base);
      stack.push(rem);
      num = Math.floor(num / this.base);
    }

    let result = '';

    while(!stack.isEmpty()) {
      result += this.digits[stack.pop()];
    }

    return result;
  }
}

let converter = new Converter(16);

converter.parse(1624)); // 658
