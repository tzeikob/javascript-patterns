// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

// Let say we have a publisher entity
myNS.Publisher = function Publisher(name, mediator) {
  this.name = name;
  this.mediator = mediator;
  this.messages = [];
};

// That publisher can broadcast messages
myNS.Publisher.prototype.broadcast = function broadcast(message) {
  this.messages.push(message);
  this.mediator.publish(this.name, message);
};

// Let say we have also a subscriber entity
myNS.Subscriber = function Subscriber(name) {
  this.name = name;
  this.messages = [];
};

myNS.Subscriber.prototype.feed = function feed(message) {
  this.messages.push(message);
};

// Create a mediator to manage publications and subscriptions
myNS.mediator = function mediator() {
  const channels = {};

  const subscribe = function subscribe(name, subscriber, cb) {
    if (!channels[name]) {
      channels[name] = [];
    }

    channels[name].push({ subscriber, cb });
  };

  const publish = function publish(name, message, ...rest) {
    if (!channels[name]) {
      return false;
    }

    channels[name].forEach(s => {
      s.subscriber.feed(message);
      s.cb.call(s.subscriber, message, ...rest);
    });
  };

  return {
    subscribe,
    publish
  };
}();

let p = new myNS.Publisher('p', myNS.mediator);

let s1 = new myNS.Subscriber('s1');
let s2 = new myNS.Subscriber('s2');

myNS.mediator.subscribe(p.name, s1, function (message, ...rest) {
  console.log(this.name, message, rest);
});

myNS.mediator.subscribe(p.name, s2, function (message, ...rest) {
  console.log(this.name, message, rest);
});

p.broadcast('Hi there, folks!');

console.log(s1.messages);
console.log(s2.messages);
