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

  // Initiate instance to be undefined
  let instance;

  return {
    getInstance: function getInstance() {
      if (!instance) {
        // Create the instance once only
        instance = new Alpha();
      }

      return instance;
    }
  };
}();

// Here you get the same instance
let a1 = myNS.module.getInstance();
let a2 = myNS.module.getInstance();

if (a1 === a2) {
  console.log('We are equal!'); // We are equal!
}
