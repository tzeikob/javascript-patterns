import bcrypt from "bcrypt";

function encrypt (text, rounds) {
  return bcrypt.hash(text, rounds);
}

encrypt("some text", 10)
  .then((hash) => encrypt(hash, 10))
  .then((hash) => encrypt(hash, 10))
  .then((hash) => {
    console.log(hash);
  })
  .catch((error) => {
    console.error(error);
  });