import { v4 as uuidv4 } from 'uuid';

const datastore = (() => {
  const users = [
    { id: 1, handle: "bob", role: "admin" },
    { id: 2, handle: "alice", role: "author" }
  ];

  async function getUser (query, middlewares = []) {
    if (!query) {
      throw new Error("Invalid query argument");
    }

    if (!middlewares || !Array.isArray(middlewares)) {
      throw new Error("Invalid middlewares argument");
    }

    for (const middleware of middlewares) {
      await middleware(query);
    }

    const response = {
      data: users.find((user) => user.handle === query.username),
      requestId: query.requestId,
      timestamp: query.timestamp
    }
  
    return response;
  }

  return { getUser };
})();

const middlewares = [
  (query) => new Promise((resolve, reject) => setTimeout(() => {
    try {
      query.requestId = uuidv4();

      resolve(query);
    } catch(error) {
      reject(error);
    }
  })),
  (query) => new Promise((resolve, reject) => setTimeout(() => {
    try {
      query.timestamp = Date.now();
  
      resolve(query);
    } catch (error) {
      reject(error);
    }
  }))
];

datastore.getUser({ username: "alice" }, middlewares)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });

// Async output:
// {
//   data: { id: 2, handle: 'alice', role: 'author' },
//   requestId: '623cbd11-5f1d-463b-90a4-5e0216b93207',
//   timestamp: 1620409821851
// }