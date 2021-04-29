import api from "api";

async function totalSales (readers, concurrency) {
  const queue = [];
  let total = 0;

  async function next () {
    while (true) {
      if (readers.length === 0) {
        return;
      }

      if (queue.length < concurrency) {
        const reader = readers.shift();
        queue.push(reader);
      }

      await new Promise((resolve) => setImmediate(resolve));
    }
  }

  const executors = [];

  for (let i = 0; i < concurrency; i++) {
    executors[i] = async () => {
      while (true) {
        if (queue.length === 0 && readers.length === 0) {
          return;
        }

        const reader = queue.shift();

        if (reader) {
          const result = await reader();
          total += result;
        } else {
          await new Promise((resolve) => setImmediate(resolve));
        }
      }
    }
  }

  const n = next();
  const e = executors.map(ex => ex());
  await Promise.all([n, ...e]);

  return total;
}

async function atlantic () {
  const sales = await api.atlantic.sales.find();
  const total = sales.reduce((sum, sl) => sum + sl.amount, 0);

  return total;
}

async function europe () {
  const exchangeRate = 1.126;

  const transactions = await api.europe.transactions.find();
  let total = transactions.reduce((sum, tx) => sum + tx.payment.total, 0);
  total *= exchangeRate;

  return total;
}

async function kepler78b () {
  const exchangeRate = 2.786;

  const exports = await api.exoplanet("kepler78b").exports.find();
  let total = exports.reduce((sum, ex) => sum + ex.trade.coins, 0);
  total *= exchangeRate;

  return total;
}

const readers = [atlantic, europe, kepler78b];

totalSales(readers, 2)
  .then((total) => console.log(total))
  .catch((error) => console.error(error));

// Async output:
// 500600150.46