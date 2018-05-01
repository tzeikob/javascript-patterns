// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

// Let say we have a model with an entity
myNS.Entity = function Entity(data) {
  this.key = data.key;

  // Encapsulate non unique properties into a flyweight
  this.flyweight = myNS.factory.get(data.x, data.y, data.z);
};

// Create entities through a factory of flyweights
myNS.Flyweight = function Flyweight(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
};

myNS.factory = function factory() {
  const items = {};
  let count = 0;

  const get = function get(x, y, z) {
    // Create a flyweight once by its unique data signature
    const signature = String(x) + String(y) + String(z);

    if (!items[signature]) {
      items[signature] = new myNS.Flyweight(x, y, z);
      count++;
    }

    return items[signature];
  };

  const size = function size() {
    return count;
  };

  return {
    get,
    size
  };
}();

// We need to collect a large amount of entities
myNS.collector = function collector() {
  const items = {};
  let count = 0;

  const add = function add(item) {
    items[item.key] = item;
    count++;

    return item;
  };

  const get = function get(key) {
    return items[key];
  };

  const size = function size() {
    return count;
  };

  return {
    add,
    get,
    size
  };
}();

// Let say we have some look-up tables
const xs = ['term1', 'term2', 'term3', 'term4'];
const ys = [1, 2, 3, 4, 5];
const zs = [true, false];

// Collect a large amount of random objects
for (let i = 0; i < 100000; i++) {
  let entity = new myNS.Entity({
    key: i,
    x: xs[Math.floor(Math.random() * 4)],
    y: ys[Math.floor(Math.random() * 5)],
    z: zs[Math.floor(Math.random() * 2)]
  });

  myNS.collector.add(entity);
}

console.log(`Entities: ${myNS.collector.size()}`);
console.log(`Flyweights: ${myNS.factory.size()}`);
