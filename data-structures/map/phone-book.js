const data = new WeakMap();

class Entry {

  constructor(key, value) {
    this.key = key;
    this.value = value;
  }

  toString() {
    return `{${this.key}: ${this.value}}`;
  }
}

class PhoneBook {

  constructor() {
    data.set(this, []);
  }

  set(key, value) {
    let m = data.get(this);
    let entry = m.find(entry => key === entry.key);

    if (entry) {
      entry.value = value;
    } else {
      m.push(new Entry(key, value));
    }
  }

  get(key) {
    let m = data.get(this);
    let entry = m.find(entry => key === entry.key);

    if (entry) {
      return entry.value;
    } else {
      return undefined;
    }
  }

  delete(key) {
    let m = data.get(this);
    let index = m.findIndex(entry => key === entry.key);

    if (index !== -1) {
      m.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }

  has(key) {
    let m = data.get(this);
    return m.findIndex(entry => key === entry.key) !== -1;
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

  keys() {
    let m = data.get(this);
    return m.map(entry => entry.key);
  }

  values() {
    let m = data.get(this);
    return m.map(entry => entry.value);
  }

  toString() {
    return `Map: [${data.get(this).join(', ')}]`;
  }
}

module.exports = PhoneBook;
