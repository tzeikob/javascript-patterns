# The Observer Pattern #

[Back to Home](../../../../)

The observer pattern belongs to the category of those design patterns called *behavioral*. That pattern allows you to manage a collection or a group of objects so they can *watch* another object, *the subject*, and be *notified* of its changes. In addition you get a loosely coupled system of objects having less dependencies between them.

## Implementation ##

In the observer pattern a group of objects is watching another single object known as the *focal point*. In order to get a more clear picture of what this is about, think of that group as a collection of services like logging, auditing etc. Each one of those services is called *observer* and can be used and coupled within an object having some behavior. Each time that object has something to report it should iterate through its observer list and fire up the notification method they provide, so each observer gets back a notification call.

```JavaScript
// Use your own namespace to keep global scope clean
var myNS = myNS || Object.create(null);

// Let say we have a model with an entity
myNS.Entity = function Entity(data) {
  this.id = data.id;
  this.value = data.value;
};

// We give it some behavior
myNS.Entity.prototype.update = function update(value) {
  this.value += value;
  return this.value;
};

// Extend it to have an observable entity
myNS.ObservableEntity = function ObservableEntity(data) {
  myNS.Entity.call(this, data);
  this.observers = [];
};

myNS.ObservableEntity.prototype = Object.create(myNS.Entity.prototype);

myNS.ObservableEntity.prototype.attach = function attach(observer) {
  this.observers.push(observer);
};

myNS.ObservableEntity.prototype.notify = function notify(context) {
  this.observers.forEach(o => {
    o.notify(context);
  });
};

// Override the behavior of the entity
myNS.ObservableEntity.prototype.update = function update(value) {
  myNS.Entity.prototype.update.call(this, value);
  this.notify({
    subject: this.id,
    payload: this.value
  });
};

// Let say you have an observer service accepting callbacks
myNS.Observer = function Observer(cb) {
  this.cb = cb;
};

myNS.Observer.prototype.notify = function notify(context) {
  this.cb(context);
};

// Create some observer services
let o1 = new myNS.Observer((context) => {
  console.log(`Subject ${context.subject} updated at ${new Date()}`);
});

let o2 = new myNS.Observer((context) => {
  console.log(`Subject ${context.subject} updated to ${context.payload}`);
});

// Attach the observers to an observable object
let e = new myNS.ObservableEntity({
  id: '1',
  value: 1
});

e.attach(o1);
e.attach(o2);

e.update(10);
```

[Go to Source](index.js)

## Use Cases ##
* [Auditor](auditor.js)

## Considerations ##

### Pros ###
* Each object has its responsibilities getting a loosely coupled system.
* You get a clear hierarchy of objects.
* You can manage objects they can cooperate each other.

### Cons ###
* You have to be familiar with other design pattern before use this one.

[Back to Home](../../../../)
