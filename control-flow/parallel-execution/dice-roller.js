function roll (faces) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const face = Math.floor(Math.random() * faces) + 1;
        resolve(face);
      } catch (error) {
        reject(error);
      }
    }, Math.floor(Math.random() * 600) + 1);
  });
}

async function turn (rolls, faces) {
  if (!rolls || !Array.isArray(rolls) || rolls.length === 0) {
    throw new Error("Invalid tasks argument");
  }

  const thrown = rolls.map((roll) => roll(faces));
  const results = await Promise.all(thrown);

  return results;
}

turn ([roll, roll, roll], 6)
  .then((results) => console.log(results))
  .catch((error) => console.error(error));

// Async output:
// [ 6, 6, 1 ]