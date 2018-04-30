const Map = require('./map');

class PhoneBook {

  constructor() {
    this.index = new Map();
  }

  add(name, phone) {
    this.index.set(name, phone);
  }

  find(name) {
    return this.index.get(name);
  }

  delete(name) {
    return this.index.delete(name);
  }

  toString() {
    return this.index.toString() + '';
  }
}

let pb = new PhoneBook();

pb.add('bob', '20-2233322'); // [{bob: 20-2233322}]
pb.add('alice', '20-6667799'); // [{bob: 20-2233322}, {alice: 20-6667799}]

pb.delete('bob'); // [{alice: 20-6667799}]

pb.find('bob'); // null
pb.find('alice'); // 20-6667799
