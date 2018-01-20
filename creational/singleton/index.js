// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.module = function module() {
  // Let's create a dummy constructor
  const Alpha = function Alpha() {
    this.value = Math.random();
  };

  Alpha.prototype.log = function log() {
    console.log(`A{ value: ${this.value} }`);
  };

  // Initiate singleton to be undefined
  let singleton;

  return {
    getInstance: function getInstance() {
      if (!singleton) {
        // Create the singleton once only
        singleton = new Alpha();
      }

      return singleton;
    }
  };
}();

// Here you get the same instance
let a1 = myNS.module.getInstance();
let a2 = myNS.module.getInstance();

if (a1 === a2) {
  console.log('We are equal!'); // We are equal!
}
