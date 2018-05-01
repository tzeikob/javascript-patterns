// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

myNS.factory = function factory() {
  // Create some reusable constructors to expose
  const Alpha = function Alpha(value) {
    this.value = value;
  };

  Alpha.prototype.log = function log() {
    console.log(`A{ value: ${this.value} }`);
  };

  const Beta = function Beta(value) {
    this.value = value;
  };

  Beta.prototype.log = function log() {
    console.log(`B{ value: ${this.value} }`);
  };

  // Index constructors into a dictionary
  const dict = [{
      name: 'alpha',
      source: Alpha
    },
    {
      name: 'beta',
      source: Beta
    }
  ];

  // Cache dictionary items into a public vocabulary
  const vocab = {};

  dict.forEach(item => {
    vocab[item.name] = item.source;
  });

  // Here you can reveal the vacabulary
  return vocab;
}();

let a = new myNS.factory.alpha(5);
let b = new myNS.factory.beta(9);

a.log(); // A{ value: 5 }
b.log(); // B{ value: 9 }
