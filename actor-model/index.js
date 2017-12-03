const EventEmitter = require('events').EventEmitter;

const model = function model() {
  const mailbox = new EventEmitter();

  function actor(behavior) {
    // Assign a unique address
    const address = Symbol();

    // Initiate the internal state
    let state = {};

    if (typeof behavior.init === 'function') {
      state = behavior.init();
    }

    // Attach actor into messaging by its address
    mailbox.on(address, function(payload) {
      const action = behavior[payload.method];
      state = action(state, payload.message) || state;
    });

    return address;
  }

  function send(address, payload) {
    mailbox.emit(address, payload);
  }

  return {
    actor,
    send
  };
}();

const counter = {
  init() {
    return { count: 0 };
  },

  increment(state, { value }) {
    let count = state.count + value;
    return { count };
  },

  log(state) {
    console.log(state.count);
  }
};

const a = model.actor(counter);

model.send(a, {
  method: 'log'
}); // 0

model.send(a, {
  method: 'increment',
  message: {
    value: 1
  }
});

model.send(a, {
  method: 'log'
}); // 1
