import bcrypt from 'bcrypt';

function encrypt (text, rounds) {
  if (!text || typeof text !== "string") {
    return Promise.reject(new Error("Invalid text argument"));
  }

  if (!rounds || typeof rounds !== "number") {
    return Promise.reject(new Error("Invalid rounds argument"));
  }

  return bcrypt.hash(text, rounds);
}

encrypt('some text', 10)
  .then((hash) => encrypt(hash, 10))
  .then((hash) => encrypt(hash, 10))
  .then((hash) => {
    console.log(hash);
  })
  .catch((error) => {
    console.error(error);
  });

// Async output:
// $2b$10$YORr..89ajQdPKhCCN39nuLaP5WULhGopzXSv3iQeuMB3m3a0jwz6