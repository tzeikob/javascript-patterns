const StopwatchFactory = function StopwatchFactory(resolution) {
  let elapsed = 0;

  // Declare the update step handler
  const update = function update() {
    elapsed += 1;
  };

  // Fire up the stopwatch update interval handler
  let intervalId = setInterval(update, resolution);

  return {
    watch: function watch() {
      return elapsed;
    },
    reset: function reset() {
      elapsed = 0;
    },
    dispose: function clear() {
      clearInterval(intervalId);
    }
  };
};

const stopwatch = StopwatchFactory(1000);

stopwatch.watch(); // 0
stopwatch.reset();
stopwatch.dispose();
