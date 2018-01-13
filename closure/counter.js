const CounterFactory = function CounterFactory(value) {
  let initialValue = value || 0;

  return {
    count: function count() {
      value += 1;
      return value;
    },
    reset: function reset() {
      value = initialValue;
    }
  };
};

const counter = CounterFactory(5);

counter.count(); // 6
counter.count(); // 7
counter.reset();
counter.count(); // 6
