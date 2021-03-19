import bcrypt from "bcrypt";

const passwords = ["secret", "s3cure", "t0psecret"];

const tasks = passwords.map((password) => bcrypt.hash(password, 10));

Promise.all(tasks)
  .then((results) => {
    console.log(results);
  })
  .catch((error) => {
    console.error(error);
  });

  // Async output:
// [
//   '$2b$10$xBHxM62qp9B79uXOC1ssd.B9u7g8RNFJdLTFOgm1OrCCIMN1VG1F2',
//   '$2b$10$/OzzZm3nIc3xp4PvvhyZ2eH7ds5/d2Oc2OC7wo8GpydkLmna5/tje',
//   '$2b$10$1M9CRKrTopV0eMjQICvyW.QOMZ5jExvl/0Ep3k2faMLosjaA6nVEm'
// ]