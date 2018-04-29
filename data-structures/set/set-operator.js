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

let sa = new Set();
sa.add(1);
sa.add(2);
sa.add(3);

let sb = new Set();
sb.add(2);
sb.add(3);
sb.add(4);

SetOperator.union(sa, sb); // [1, 2, 3, 4]
SetOperator.intersection(sa, sb); // [2, 3]
SetOperator.difference(sa, sb); // [1]
SetOperator.subset(new Set()); // false
