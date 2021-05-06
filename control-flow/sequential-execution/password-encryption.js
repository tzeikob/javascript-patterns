import bcrypt from 'bcrypt';

function encryption (password, rounds, cb) {
  if (!password || typeof password !== 'string') {
    return setTimeout(() => cb(new Error('Invalid password argument')));
  }

  if (!rounds || typeof rounds !== 'number') {
    return setTimeout(() => cb(new Error('Invalid rounds argument')));
  }

  generateSalt(password, rounds, cb);
}

function generateSalt (password, rounds, cb) {
  bcrypt.genSalt(rounds, (error, salt) => {
    if (error) {
      return cb(error);
    }

    encrypt(password, salt, cb);
  });
}

function encrypt (password, salt, cb) {
  bcrypt.hash(password, salt, (error, hash) => {
    if (error) {
      return cb(error);
    }

    validate(password, hash, cb);
  });
}

function validate (password, hash, cb) {
  bcrypt.compare(password, hash, (error, valid) => {
    if (error) {
      return cb(error);
    }

    if (valid) {
      cb(null, hash);
    } else {
      cb(new Error('An error occurred during validation'));
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