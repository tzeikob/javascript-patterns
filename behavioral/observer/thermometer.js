import { sensors } from "iot";

class Thermometer {
  constructor() {
    this.running = false;
    this.previous = 0;
    this.temperature = 0;

    this.listeners = {
      increase: [],
      decrease: [],
      error: []
    };
  }

  on (event, listener) {
    const eventListeners = this.listeners[event];

    if (eventListeners) {
      eventListeners.push(listener);
    }

    return this;
  }

  emit (event, ...args) {
    const eventListeners = this.listeners[event];

    if (eventListeners) {
      eventListeners.forEach((listener) => {
        listener.call(null, ...args);
      });
    }
  }

  async start () {
    this.running = true;

    while (this.running) {
      try {
        this.previous = this.temperature;
        this.temperature = await sensors.readTemperature();

        const delta = this.temperature - this.previous;

        if (delta > 0) {
          this.emit("increase", this.temperature, delta);
        } else if (delta < 0) {
          this.emit("decrease", this.temperature, delta);
        }
      } catch (error) {
        this.emit("error", error);
      }
    }
  }

  stop () {
    this.running = false;
  }

  removeListener (event, listener) {
    const eventListeners = this.listeners[event];
    
    if (eventListeners) {
      const index = eventListeners.findIndex((l) => l === listener);
      eventListeners.splice(index, 1);
    }
  }
}

const t = new Thermometer();

t.start();

t.on("increase", (temp, delta) => {
  console.log({ temp, delta });
});

t.on("decrease", (temp, delta) => {
  console.log({ temp, delta });
});

t.on("error", (error) => {
  console.error(`Error: ${error.message}`)
});

// Async output:
// { temp: -1, delta: -1 }
// { temp: -3, delta: -2 }
// { temp: -5, delta: -2 }
// { temp: -7, delta: -2 }