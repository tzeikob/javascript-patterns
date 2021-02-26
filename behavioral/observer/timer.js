class Thermometer {

  constructor () {
    this.previous = 0;
    this.temperature = 0;

    this.listeners = {
      "increase": [],
      "decrease": [],
      "error": []
    };
  }

  on (event, listener) {
    if (!/^(increase|decrease|error)$/.test(event)) {
      throw new Error(`Event type is not supported: ${event}`);
    }

    this.listeners[event].push(listener);

    return this;
  }

  emit (event, ...args) {
    this.listeners[event].forEach(listener => {
      listener.call(null, ...args);
    });
  }

  update (value) {
    setTimeout(() => {
      try {
        this.previous = this.temperature;
        this.temperature = value;

        const delta = this.temperature - this.previous;

        if (delta > 0) {
          this.emit("increase", this.temperature, delta);
        } else if (delta < 0) {
          this.emit("decrease", this.temperature, delta);
        }
      } catch (error) {
        this.emit("error", error);
      }
    });
  }
}

const t = new Thermometer();

t.update(10);

t.on("increase", (temp, delta) => console.log(`Temperature increased up to ${temp} with a delta ${delta}`))
  .on("decrease", (temp, delta) => console.log(`Temperature decreased to ${temp} with a delta ${delta}`))
  .on("error", error => console.error(`An error occurred updating the temperature: ${error.message}`));

t.update(-15);
t.update(8);
t.update(8);

// Temperature increased up to 10 with a delta 10
// Temperature decreased to -15 with a delta -25
// Temperature increased up to 8 with a delta 23