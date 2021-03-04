const request = require('request-promise');

// A dummy promise to emulate pause for some time in secs
const pause = function pause(secs) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, secs * 1000);
  });
};

// An async task to get the data of a github account
const task = async function task(options, retries) {
  for (let i = 1; i <= retries; i++) {
    try {
      return await request(options);
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

task({
    uri: 'https://api.github.com/users/tzeikob',
    headers: {
      'User-Agent': 'Awesome-Promise'
    },
    json: true
  }, 3)
  .then(function(response) {
    console.log(`Task succeed, ${response.login} has ${response.public_repos} repos`);
  })
  .catch(function(err) {
    console.log(`Task failed, ${err.message}`);
  });
