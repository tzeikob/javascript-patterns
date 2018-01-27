// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

// Let say we have a model with an entity
myNS.Entity = function Entity(x, y) {
  this.x = x;
  this.y = y;
};

// We have also a service managing those entities
myNS.service = function service() {
  const methodA = function methodA(entity) {
    return entity.x + entity.y;
  };

  const methodB = function methodB(entity) {
    return entity.x * entity.y;
  };

  return {
    methodA,
    methodB
  };
}();

// Now let say you need only a fraction of the service
myNS.wrapper = function wrapper() {
  const methodC = function methodC(entity) {
    return myNS.service.methodB(entity);
  };

  return {
    methodC
  };
}();

let e = new myNS.Entity(2, 3);

let r = myNS.wrapper.methodC(e); // 6
