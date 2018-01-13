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
  }

  const send = function send(address, payload) {
    mailbox.emit(address, payload);
  }

  return {
    actor,
    send
  };
}();

const calculator = {
  init() {
    return {
      requests: 0
    };
  },

  add(state, { address, x, y }) {
    const result = x + y;

    // Give the result back to the actor made the request
    model.send(address, {
      method: 'update',
      message: {
        value: result
      }
    });

    const requests = state.requests + 1;

    return {
      requests
    };
  }
};

const storage = {
  init() {
    return {
      value: 0
    };
  },

  update(state, { value }) {
    return {
      value
    };
  },

  log(state) {
    console.log(state.value);
  }
};

const service = model.actor(calculator);

const a = model.actor(storage);
const b = model.actor(storage);

model.send(service, {
  method: 'add',
  message: {
    address: a,
    x: 33,
    y: 63
  }
});

model.send(service, {
  method: 'add',
  message: {
    address: b,
    x: 23,
    y: 13
  }
});

model.send(a, {
  method: 'log'
}); // 96

model.send(b, {
  method: 'log'
}); // 36
