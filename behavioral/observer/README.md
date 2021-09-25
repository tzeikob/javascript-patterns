# The Observer Pattern

The observer pattern belongs to the category of those design patterns called **behavioral**. This pattern allows you to manage a collection of callbacks called **listeners**, so they can be triggered by another object, called the **subject** or the **observable**. According to this pattern an observable should emit various events during an operation and call every registered listener for each event, in order other parts of the code to get notified.

In every emission an observable could pass data to the listeners according to the operation is running at the given time. In case an error is thrown the observable should emit a special error event along with the thrown error object. By convention an observable must expose an api in order to allow registering and removing listeners at any time. One important thing is that a registered listener must be triggered in the same order it has been registered in.

## Implementation

In the observer pattern an observable is an object also known as the **focal point**, so we can define an observable as a class having initially an empty collection of listeners. This collection is expected to be a map, where the keys are the event types and for each event type we are about to keep an ordered list of listeners meant to be triggered each time a specific event is emitted.

### Attach listeners to an observable

The way to attach a listener to an observable is straightforward, we should provide the `event` type along with the `listener` and append it to the list of `listeners` for that specific event type. The order the listeners are attached must be attained in the whole life-cycle of the observable so they can be called in order. To be more precise the observable should define what event types emits, so at creation we initiate each event's listeners list to an empty array. Any attempt to register a listener for a not supported event type should be ignored by convention.

```javascript
class Observable {
  constructor () {
    // A map of listeners per event
    this.listeners = {
      success: [],
      ...,
      error: []
    };
  }

  on (event, listener) {
    const eventListeners = this.listeners[event];

    if (eventListeners) {
      // Register the listener for the given event
      eventListeners.push(listener);
    }

    return this;
  }
}
```

> The `error` event type will be used for error handling as we'll see later on.

### Emit events from an observable

By this time we need a mechanism in order to broadcast events, so every listener is triggered for its corresponding event being emitted. Having the map of listeners per event we only need to iterate through and call them in the specified order along with any data arguments. The data arguments could be any valid value given as separated arguments.

```javascript
class Observable {
  ...

  emit (event, ...args) {
    const eventListeners = this.listeners[event];

    if (eventListeners) {
      // Trigger the listeners for the given event
      eventListeners.forEach((listener) => {
        listener.call(null, ...args);
      });
    }
  }
}
```

> We could call the listener with `this` instead of `null` in case we need to have access the observable within the listener's code via the `this` operator.

Bear in mind that this method should always be called from an asynchronous context, for instance an operation of the observable running asynchronously.

### An observable must have a purpose

An observable must have a purpose, it must provide at least one asynchronous `operation`. It doesn't have to be an asynchronous operation, even though it only makes sense to have an asynchronous observable. Within each operation the observable must use the `emit` method in order to call every listener given this event type along with any data arguments.

```javascript
class Observable {
  ...

  async operation () {
    // Execute any business logic
    const valueA = await ...
    const valueB = await ...
    ...
    
    // Emit the success of the operation
    this.emit("success", valueA, valueB, ...);
  }
}
```

> Operation is set to be an async function in order to call operations asynchronously.

### Register event listeners

Having the observable class we can now create an instance of it and register event listeners by using the `on` method given the event type and the listener.

```javascript
const observable = new Observable();

observable.on("success", (value) => {...});
observable.on("error", (error) => {...});
```

> Because the observable's `on` method returns the observable object itself, we can use chaining as well.

### Error handling in observable

A special care must be taken regarding the error handling in the observer pattern. Every time an `error` is caught in an `operation` of an observable we must emit with the special event type of `error`. The emission by convention must be triggered along with a given valid `Error` object.

```javascript
class Observable {
  ...

  async operation () {
    try {
      // Execute any business logic
      const valueA = await ...
      const valueB = await ...
      ...

      // Emit the success of the operation
      this.emit("success", valueA, valueB, ...);
    } catch (error) {
      this.emit("error", error); // Emit the thrown error
    }
  }
}
```

### Putting all together

To sum up, an observable must encapsulate a map of listeners (observers) per event type according to our requirements and broadcast events so the listeners mapped by the emitted event are executed. A special event is the error which must be triggered any time an exception is thrown. All those broadcasts and emissions must happen within an asynchronous operation so no listeners are swallowed by operations executed before the listeners being registered. Now let's put all this together.

```javascript
class Observable {
  constructor () {
    // A map of listeners per event
    this.listeners = {
      success: [],
      ...,
      error: []
    };
  }

  on (event, listener) {
    const eventListeners = this.listeners[event];

    if (eventListeners) {
      // Register the listener for the given event
      eventListeners.push(listener);
    }

    return this;
  }

  emit (event, ...args) {
    const eventListeners = this.listeners[event];

    if (eventListeners) {
      // Trigger the listeners for the given event
      eventListeners.forEach((listener) => {
        listener.call(null, ...args);
      });
    }
  }

  async operation () {
    try {
      // Execute any business logic
      const valueA = await ...
      const valueB = await ...
      ...

      // Emit the success of the operation
      this.emit("success", valueA, valueB, ...);
    } catch (error) {
      this.emit("error", error); // Emit the thrown error
    }
  }
}

const observable = new Observable();

observable.on("success", (value) => {...});
observable.on("error", (error) => {...});

observable.operation();
```

## Considerations

### Avoid memory leaks of dangling listeners

The observer pattern is a very powerful mechanism which if not taken seriously it might introduce some kind of degradation in the performance of your application. Each time a new listener is attached to an observable occupies memory because of the surrounding closure, that portion of allocation must be released when the listener not needed anymore. So we always must provide a method to remove registered listeners from an observable object. In order to remove a listener we must provide both the event type and the listener.

```javascript
class Observable {
  ...

  removeListener (event, listener) {
    const eventListeners = this.listeners[event];
    
    if (eventListeners) {
      // Find the listener and remove it
      ...
    }
  }
}
```

### Emit asynchronously to avoid swallowing listeners

What do we mean by swallowing listeners is that if we try to emit an event synchronously there is possibility to miss listeners registered after the emission of the event. Let's say we need to emit an event each time we construct an observable, anyone could think that the following code should do the job.

```javascript
class Observable {
  constructor () {
    this.emit("create");
  }

  ...
}
```

But what is happening when we call the following code is that we will miss the `create` event so the listener is never getting called.

```javascript
const observable = new Observable(); // Synchronously emits the `create` event

observable.on("create", () => {
  console.log("A new observable is created"); // This is never called
});
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

### Get access to the observable within listeners

A really reasonable request could be to give access to the observable's state within the code of each registered listener. We can do this by just calling each listener with the `this`, like so:

```javascript
class Observable {
  ...

  emit (event, ...args) {
    const eventListeners = this.listeners[event];

    if (eventListeners) {
      eventListeners.forEach((listener) => {
        // Set the observable as the `this` in listener's code
        listener.call(this, ...args);
      });
    }
  }
} 
```

Now there is a caveat here, when you're registering a listener to the observable you have to use a **function expression** instead of an arrow function, otherwise the `this` within the listener's code will point to where the `this` is referring in the outer lexical scope and not the observable.

```javascript
const observable = new Observable();

observable.on("success", function (data) {
  const value = this.value; // Get access to the observable
  ...
});
```

## Use Cases

Below you can find various trivial or real-world implementations of this pattern:

* [Thermometer](thermometer.js): A trivial implementation of an observable thermometer sensor