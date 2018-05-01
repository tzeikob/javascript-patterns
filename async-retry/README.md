# The Async Retry Pattern #

[Back to Home](../../../)

The async retry pattern meant for use cases in which you need to post an asynchronous request with the ability to *automatically retry* it after a failure, the process completes either way you get the request resolved or you reach the maximum number of retries.

## Implementation ##

That pattern makes use of the *async/await function*, which gives the ability to handle an asynchronous operation as if it was a synchronous. Syntactically the code looks like if it's synchronous and so you can read it that way, but what's really happening in the background is that the code runs in asynchronous way. Without that feature the language gives no option but to use either promises or callbacks which turns out that you end up with complex patterns and clumsy logic in your code.

```JavaScript
// A dummy promise to resolve only non-negative values
const request = function request(value) {
  return new Promise(function(resolve, reject) {
    if (value >= 0) {
      resolve(value);
    } else {
      reject(new Error(`negative values cannot be resolved: ${value}`));
    }
  });
};

// A dummy promise to emulate pause for some time in secs
const pause = function pause(secs) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, secs * 1000);
  });
};

// An async task to resolve the very first random non-negative number
const task = async function task(retries) {
  for (let i = 1; i <= retries; i++) {
    // Get a random number in the range [-1, 1)
    let value = (Math.random() * 2) - 1;

    try {
      return await request(value);
    } catch (err) {
      console.log(`Request failed, ${err.message}`);

      if (i < retries) {
        console.log(` Retry again after 2 secs...`);
        await pause(2);
      }
    }
  }

  throw new Error(`reached maximum number of retries: ${retries}`);
};

task(3)
  .then(function(value) {
    console.log(`Task succeed, resolved value: ${value}`);
  })
  .catch(function(err) {
    console.log(`Task failed, ${err.message}`);
  });
```

[Go to Source](index.js)

## Use Cases ##
* [Request](request.js)

## Considerations ##

### Pros ###
* Write code in synchronous way but run in asynchronous way.
* Cleaner logic in your code and less complex patterns.
* Better way to handle exceptions.

### Cons ###
* The async/await function feature may not be available in old EcmaScript versions.
* In functional programming maybe this feature isn't the right choice.


[Back to Home](../../../)
