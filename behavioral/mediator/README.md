# The Mediator Pattern

The mediator pattern belongs to the category of those design patterns called *behavioral*. That pattern has some similarities with the [observer](../observer/) pattern, which allows you to manage a group of objects so they can *watch* another object, *the subject*, and be *notified* of its changes. With that pattern you can get a loosely coupled system with clear hierarchies of objects they are responsible only for certain things.

## Implementation

The mediator design pattern can be better described as a *publisher/subscriber pattern* in which a subject object, which is responsible to broadcast data, should notify a mediator service which in turn should notify a group of subscribers attached to the broadcast messages of the former.

```javascript
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

    channels[name].push({
      subscriber,
      cb
    });
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

myNS.mediator.subscribe(p.name, s1, function(message, ...rest) {
  console.log(this.name, message, rest);
});

myNS.mediator.subscribe(p.name, s2, function(message, ...rest) {
  console.log(this.name, message, rest);
});

p.broadcast('Hi there, folks!');

console.log(s1.messages);
console.log(s2.messages);
```

[Go to Source](index.js)

## Use Cases
* [Sensor](sensor.js)

## Considerations

### Pros
* Each object has its responsibilities getting a loosely coupled system.
* You get a clear hierarchy of objects.

### Cons
* You have to be familiar with other design pattern before use this one.