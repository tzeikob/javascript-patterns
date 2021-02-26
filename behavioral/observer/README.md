# The Observer Pattern #

The observer pattern belongs to the category of those design patterns called **behavioral**. That pattern allows you to manage a collection of objects called **listeners**, so they can be triggered by another object, called the **subject** or the **observable**. According to this pattern an observable should emit various events and call every registered listener for each corresponding event in order other parts of the application to get notified.

## Explanation ##

In the observer pattern an observable is an object also known as the focal point, so we can define an observable as a class having an empty list of observers or listeners as they commonly called. The list of listeners should be a map of keys where each key is an event type which is expected to store the list of listener callbacks meant for this event only.

### Attach listeners to an observable ###

```javascript
class Observable {

  constructor () {
    // Map of listener lists per event
    this.listeners = {};
  }
}
```

The way to attach a listener to an observable is straightforward, we should provide the event type along with the listener callback and append it to the list of listeners of the given event type. The order the listeners are attached must be attained in the whole life-cycle of the observable object.

```javascript
class Observable {

  ...

  on (event, listener) {
    // Map the event listener in order
    this.listeners[event].push(listener);

    return this;
  }
}
```

### Emit events from an observable ###

By this time we need a mechanism in order to broadcast events so we can triggered every listener for the given event type is being emitted. Having the map of listener lists per event we only need to iterator through and call them in the specified order along with any data arguments. The data arguments must come in the form of separated arguments according to our requirements and use case.

```javascript
class Observable {

  ...

  emit (event, ...args) {
    this.listeners[event].forEach(listener => {
      listener.call(null, ...args);
    });
  }
} 
```

### An observable must have a purpose ###

An observable must have a purpose, it must provide at least one asynchronous operation. It doesn't must to be an asynchronous operation, even though it only make sense to have an asynchronous observable. Within each operation the observable must use the `emit` method in order to notify every listener given this event type along with any data arguments.

```javascript
class Observable {

  ...

  operation () {
    setTimeout(() => {
      // Let's say we emit the success of the operation
      this.emit("success", 1);
    });
  }
}
```

> Note: we are using the `setTimeout` function to mimic an asynchronous operation.

### Error handling in observable ###

A special care must be taken regarding the error handling in the observer pattern. Every time an error is caught in an operation of an observable we must emit with the special event type of `error`. The emission by convention must be triggered along with a given valid `Error` object and not any primitive or custom object value.

```javascript
class Observable {

  ...

  operation () {
    setTimeout(() => {
      // Let's say we caught a error
      try {
        this.emit("success", 1);
      } catch (error) {
        this.emit("error", new Error("Oops"));
      }
    });
  }
}
```

To sum up, an observable must encapsulate a map of listeners (observers) per event type according to our requirements and broadcast events so the listeners mapped by the emitted event are executed. A special event is the error which must be triggered any time an exception is thrown. All those broadcasts and emissions must be happen within an asynchronous operation so no listeners are swallowed by operations executed before the listeners being registered.

## Implementations ##

Below you can find various trivial or real-world implementations of this pattern:

* [thermometer](thermometer.js): a trivial implementation of an observable thermometer.

## Considerations ##
