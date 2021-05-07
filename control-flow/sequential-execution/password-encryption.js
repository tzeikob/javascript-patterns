import bcrypt from 'bcrypt';

function encryption (password, rounds, callback) {
  if (!password || typeof password !== 'string') {
    return setTimeout(() => callback(new Error('Invalid password argument')));
  }

  if (!rounds || typeof rounds !== 'number') {
    return setTimeout(() => callback(new Error('Invalid rounds argument')));
  }

  generateSalt(password, rounds, callback);
}

function generateSalt (password, rounds, callback) {
  bcrypt.genSalt(rounds, (error, salt) => {
    if (error) {
      return callback(error);
    }

    encrypt(password, salt, callback);
  });
}

function encrypt (password, salt, callback) {
  bcrypt.hash(password, salt, (error, hash) => {
    if (error) {
      return callback(error);
    }

    validate(password, hash, callback);
  });
}

function validate (password, hash, callback) {
  bcrypt.compare(password, hash, (error, valid) => {
    if (error) {
      return callback(error);
    }

    if (valid) {
      callback(null, hash);
    } else {
      callback(new Error('An error occurred during validation'));
    }
  });
}

encryption('secret', 10, (error, hash) => {
  if (error) {
    return console.error(error);
  }

  console.log(hash);
});

// Async output:
// $2b$10$YdpHArdPZFMqbUqOcTAG..Vd9kVynRvIvL8Z7aLbfaZIipURY0dN6