var myNS = myNS || Object.create(null);

myNS.Sensor = function Sensor(name, threshold, mediator) {
  this.name = name;
  this.threshold = threshold;
  this.mediator = mediator;
  this.values = [];
};

myNS.Sensor.prototype.on = function on(secs) {
  if (!this.iid) {
    this.iid = setInterval(() => {
      this.measure();
    }, secs * 1000);
  }
};

myNS.Sensor.prototype.off = function off() {
  if (this.iid) {
    clearInterval(this.iid);
  }
};

myNS.Sensor.prototype.measure = function measure() {
  let value = Math.floor(Math.random() * 10);

  this.values.push(value);

  if (value > this.threshold) {
    this.mediator.publish(this.name, value);
  }
};

myNS.Device = function Device(name, cb) {
  this.name = name;
  this.cb = cb;
};

myNS.controller = function controller() {
  const channels = {};

  const subscribe = function subscribe(name, device) {
    if (!channels[name]) {
      channels[name] = [];
    }

    channels[name].push(device);
  };

  const publish = function publish(name, value) {
    if (!channels[name]) {
      return false;
    }

    channels[name].forEach(d => {
      d.cb.call(d, value);
    });
  };

  return {
    subscribe,
    publish
  };
}();

let s1 = new myNS.Sensor('s1', 6, myNS.controller);

let d1 = new myNS.Device('d1', function(value) {
  console.log(this.name, value);
});

let d2 = new myNS.Device('d2', function(value) {
  console.log(this.name, value);
});

myNS.controller.subscribe(s1.name, d1);
myNS.controller.subscribe(s1.name, d2);

s1.on(1);
