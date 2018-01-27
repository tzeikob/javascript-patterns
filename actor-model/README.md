# The Actor Model #

[Back to Home](../../../)

The Actor Model is more than a design pattern, it's rather a conceptual model was proposed in the 70's by Carl Hewitt in order to deal with concurrent computation in large applications. You can think of the *Actor* as the foundation on which you can build the structure of an application. Each actor has a public *unique address* and an *internal state* private to the outer world of its scope. In addition has a *behavior* map which defines what the actor can do. Each actor interacts with other actors only through *asynchronous* messages, they must be delivered asynchronously and executed in a synchronous manner by the receiver. Each time a message is processed by an actor, it is matched against its *behavior* map which is nothing more than an object that defines the method/action to be taken in reaction to the given message payload. Actor's response to a message may be,

* create more actors,
* send messages to other actors,
* update internal state to handle the next message.

In conclusion some after thoughts about actors and how they interact into a system of actors is that,

* actors can execute in parallel,
* actors don't share state each other,
* actors communicate asynchronously and only through messages,
* each actor has a queue to receive messages from other actors,
* each message sent must be immutable.

## Implementation ##

### Messaging ###

In order to implement the Actor Model you must have in advance an asynchronous messaging controller or emitter, who will be responsible for each message delivery between the actors. The messaging system can use the actor's unique address in order to specify the target of the delivery.

```
const mailbox = new EventEmitter();

mailbox.on('actor-address', function(payload) {});
mailbox.emit('actor-address', payload);
```

### Behavior ###

The next big thing is to define the behavior of the actors they can adopt in order to handle incoming messages. The concept here is that the behavior is a simple object having a set of exposed methods but internal state and follow certain rules,

* must initialize the state of the actor exposing a method which returns that state,
* each other method must have as input the current state and an optional object of data to work with,
* and return the updated state, so any following message has access to the next state.

```
const behavior = {
  init() {
    return { value: 0 };
  },

  methodA(state, { amount }) {
    let value = state.value + amount;
    return { value };
  },

  methodB(state, { amount }) {
    let value = state.value - amount;
    return { value };
  }
}
```

### Actors ###

Actors are the foundation part of the application and they need to have access to both the messaging system and the behavior they can adopt. Each time an actor is created we must provide the behavior and several things must take place,

* assign a unique address to the actor,
* initiate its internal state using the behavior's initialization method,
* attach the actor, so to able to receive messages,
* return the unique address back to the application.

```
function actor(behavior) {
  const address = Symbol();

  let state = {};

  if (typeof behavior.init === 'function') {
    state = behavior.init();
  }

  mailbox.on(address, function(payload) {
    const method = behavior[payload.method];
    state = method(state, payload.message) || state;
  });

  return address;
}
```

Each time an actor sends a message to another actor, it must provide, along with the actor's address, a payload that contains the name of the method that needs to be executed and optional data if applicable.

```
function send(address, payload) {
  mailbox.emit(address, payload);
}
```

### Put all together ###

```
const EventEmitter = require('events').EventEmitter;

const model = function model() {
  const mailbox = new EventEmitter();

  const actor = function actor(behavior) {
    // Assign a unique address
    const address = Symbol();

    // Initiate the internal state
    let state = {};

    if (typeof behavior.init === 'function') {
      state = behavior.init();
    }

    // Attach actor into messaging by its address
    mailbox.on(address, function(payload) {
      const method = behavior[payload.method];
      state = method(state, payload.message) || state;
    });

    return address;
  };

  const send = function send(address, payload) {
    mailbox.emit(address, payload);
  };

  return {
    actor,
    send
  };
}();

const behavior = {
  init() {
    return { count: 0 };
  },

  methodA(state, { value }) {
    let count = state.count + value;
    return { count };
  },

  methodB(state) {
    console.log(state.count);
  }
};

const a = model.actor(behavior);

model.send(a, {
  method: 'methodB'
}); // 0

model.send(a, {
  method: 'methodA',
  message: {
    value: 1
  }
});

model.send(a, {
  method: 'methodB'
}); // 1
```

[Go to Source](index.js)

## Use Cases ##
* [Calculator and storages](calculator.js)

## Considerations ##

### Pros ###
* It provides the basics in order to play around with the Actor Model.

### Cons ###
* An application may contain a potentially large number of actors, so using closures to keep internal state may not be the best solution.
* It is easy to mess things up due to the immutability in JavaScript.

[Back to Home](../../../)
