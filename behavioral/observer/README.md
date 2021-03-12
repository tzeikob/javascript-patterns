# The Observer Pattern #

The observer pattern belongs to the category of those design patterns called **behavioral**. This pattern allows you to manage a collection of callbacks called **listeners**, so they can be triggered by another object, called the **subject** or the **observable**. According to this pattern an observable should emit various events during an operation and call every registered listener for each event, in order other parts of the code to get notified.

## Explanation ##

In the observer pattern an observable is an object also known as the **focal point**, so we can define an observable as a class having initially an empty collection of listeners. This collection is expected to be a map, where the keys are the event types and for each event type we are about to keep an ordered list of listeners meant to be triggered each time a specific event being emitted.

### Attach listeners to an observable ###

The way to attach a listener to an observable is straightforward, we should provide the event type along with the listener and append it to the list of listeners for that specific event type. The order the listeners are attached must be attained in the whole life-cycle of the observable so they can be called in order.

```javascript
class Observable {
  constructor () {
    // A map of listeners per event
    this.listeners = {};
  }

  on (event, listener) {
    // Register the listener for the given event
    this.listeners[event].push(listener);

    return this;
  }
}
```

### Emit events from an observable ###

By this time we need a mechanism in order to broadcast events, so every listener is triggered for its corresponding event is being emitted. Having the map of listeners per event we only need to iterate through and call them in the specified order along with any data arguments. The data arguments could be any valid value and can be given either as separated arguments or collected in a single custom object passing them as a single argument.

```javascript
class Observable {
  ...

  emit (event, ...args) {
    // Trigger the listeners for the given event
    this.listeners[event].forEach(listener => {
      listener.call(null, ...args);
    });
  }
} 
```

> We could call the listener with `this` instead of `null` in case we need to access the observable within the listener's code for farther use via the `this` operator.

### An observable must have a purpose ###

An observable must have a purpose, it must provide at least one asynchronous operation. It doesn't have to be an asynchronous operation, even though it only makes sense to have an asynchronous observable. Within each operation the observable must use the `emit` method in order to call every listener given this event type along with any data arguments.

```javascript
class Observable {
  ...

  operation () {
    setTimeout(() => {
      // Execute any business logic
      const valueA = ...
      const valueB = ...
      ...

      // Emit the success of the operation
      this.emit("success", valueA, valueB, ...);
    });
  }
}
```

> We are using the `setTimeout` function to mimic the execution of an asynchronous operation.

### Register event listeners ###

Having the observable class we can now create an instance of it and register event listeners by using the `on` method given the event type and the listener.

```javascript
const observable = new Observable();

observable.on("data", (value) => {
  ...
});

observable.on("success", (value) => {
  ...
});

observable.on("error", (error) => {
  ...
});
```

> Because the observable's `on` method is implemented such to return the observable object, we can use chaining as well.

### Error handling in observable ###

A special care must be taken regarding the error handling in the observer pattern. Every time an error is caught in an operation of an observable we must emit with the special event type of `error`. The emission by convention must be triggered along with a given valid `Error` object and not any primitive or custom object value.

```javascript
class Observable {
  ...

  operation () {
    setTimeout(() => {
      try {
        // Execute any business logic
        const valueA = ...
        const valueB = ...
        ...

        this.emit("success", valueA, valueB, ...);
      } catch (error) {
        this.emit("error", error); // Emit the thrown error
      }
    });
  }
}
```

To sum up, an observable must encapsulate a map of listeners (observers) per event type according to our requirements and broadcast events so the listeners mapped by the emitted event are executed. A special event is the error which must be triggered any time an exception is thrown. All those broadcasts and emissions must happen within an asynchronous operation so no listeners are swallowed by operations executed before the listeners being registered.

## Implementations ##

Below you can find various trivial or real-world implementations of this pattern:

* [thermometer](thermometer.js): a trivial implementation of an observable thermometer

## Considerations ##

### Avoid memory leaks of dangling listeners ###

The observer pattern is a very powerful mechanism which if not taken seriously it might introduce some kind of degradation in the performance of your application. Each time a new listener is attached to an observable occupies memory because of the surrounding closure, that portion of allocation must be released when the listener not needed anymore. So we always must provide a method to remove registered listeners from an observable object. In order to remove a listener we must provide both the event type and the listener.

```javascript
class Observable {
  ...

  removeListener (event, listener) {
    const listeners = this.listeners[event];
    
    if (listeners) {
      // Find the listener and remove it
      ...
    }
  }
}
```

### Emit asynchronously to avoid swallowing listeners ###

What do we mean by swallowing listeners is that if we try to emit an event synchronously there is possibility to miss listeners registered after the emission of the event. Let's say we need to emit an event each time we construct an observable, anyone could think that the following code should do the job,

```javascript
class Observable {
  constructor () {
    this.emit("create");
  }

  ...
}
```

but what is happening when we call the following code is that we will miss the `create` event so the listener is never getting called.

```javascript
const observable = new Observale(); // Synchronously emits the `create` event

observable.on("create", () => {
  console.log("A new observable is created");
}); // This listener is never called
```

What we need to do is to always emit events asynchronously in the next event loop cycle in order to let the listeners to be registered within the same event loop cycle and be available for invocation.

```javascript
class Observable {
  constructor () {
    // Emit the event in the next event loop cycle
    setTimeout(() => this.emit("create"));
  }

  ...
}
```

### Get access to the observable within listeners ###

A really reasonable request could be to give access to the observable's state within the code of each registered listener. We can do this by just calling each listener with the `this` like so,

```javascript
class Observable {
  ...

  emit (event, ...args) {
    // Trigger the listeners for the given event
    this.listeners[event].forEach(listener => {
      // Set the observable as the `this` in listener's code
      listener.call(this, ...args);
    });
  }
} 
```

now there is a caveat here, when you're registering a listener to the observable you have to use a **function expression** instead of an arrow function otherwise the `this` within the listener's code will point to where the `this` is referring in the outer lexical scope and not the observable.

```javascript
const observable = new Observable();

observable.on("success", function (data) {
  // Get access to the observable's state via this
  const value = this.value;
  ...
});
```