import bcrypt from 'bcrypt';

function encrypt (text, rounds) {
  return bcrypt.hash(text, rounds);
}

async function encryption (input, rounds) {
  if (!input) {
    throw new Error("Missing or invalid input argument");
  }

  if (!rounds) {
    throw new Error("Missing or invalid rounds argument");
  }

  let result = await encrypt(input, rounds);
  result = await encrypt(result, rounds);
  result = await encrypt(result, rounds);

  return result;
}

encryption('some text', 10)
  .then((hash) => {
    console.log(hash);
  })
  .catch((error) => {
    console.error(error);
  });

// Async output:
// $2b$10$ChgJpS.dfXtGJJFbmM0BS.G2ciCGcyhEtD9VHn1veokfK1g1Pntya