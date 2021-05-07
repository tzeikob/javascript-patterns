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

    const user = users.find((user) => user.handle === query.username);
  
    return { user, ...query };
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
//   user: { id: 2, handle: 'alice', role: 'author' },
//   username: 'alice',
//   requestId: 'a7de3dc0-1fc2-4508-969b-ea724bf36091',
//   timestamp: 1620410644011
// }