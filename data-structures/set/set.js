const data = new WeakMap();

class Set {

  constructor() {
    data.set(this, []);
  }

  add(item) {
    if (this.has(item)) {
      return false;
    }

    data.get(this).push(item);

    return true;
  }

  remove(item) {
    if (!this.has(item)) {
      return false;
    }

    let values = data.get(this);
    let index = values.indexOf(item);
    values.splice(index, 1);

    return true;
  }

  has(item) {
    return data.get(this).indexOf(item) !== -1;
  }

  isEmpty() {
    return this.size() === 0;
  }

  clear() {
    data.set(this, []);
  }

  size() {
    return data.get(this).length;
  }

  values() {
    return data.get(this);
  }

  toString() {
    return `Set: [${data.get(this).join(', ')}]`;
  }
}

module.exports = Set;
