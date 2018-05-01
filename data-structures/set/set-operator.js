const Set = require('./set');

class SetOperator {

  static union(setA, setB) {
    let u = new Set();

    setA.values().forEach(value => {
      u.add(value);
    });

    setB.values().forEach(value => {
      u.add(value);
    });

    return u;
  }

  static intersection(setA, setB) {
    let i = new Set();

    setA.values().forEach(value => {
      if (setB.has(value)) {
        i.add(value);
      }
    });

    return i;
  }

  static difference(setA, setB) {
    let d = new Set();

    setA.values().forEach(value => {
      if (!setB.has(value)) {
        d.add(value);
      }
    });

    return d;
  }

  static subset(setA, setB) {
    if (setA.size() === 0 || setB.size() === 0) {
      return false;
    }

    if (setA.size() > setB.size()) {
      return false;
    }

    return setA.values().every(value => setB.has(value));
  }
}

module.exports = SetOperator;
