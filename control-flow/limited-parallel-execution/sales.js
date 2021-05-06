import api from "api";

async function totalSales (readers, concurrency) {
  if (!readers || !Array.isArray(readers) || readers.length === 0) {
    throw new Error("Invalid readers argument");
  }

  if (!concurrency || typeof concurrency !== "number" || concurrency <= 0) {
    throw new Error("Invalid concurrency argument");
  }

  let total = 0;

  async function executor () {
    while (readers.length > 0) {
      const reader = readers.shift();
      const result = await reader();

      total += result;
    }
  }

  const executors = [];

  for (let i = 0; i < concurrency; i++) {
    executors[i] = executor(i);
  }

  await Promise.all(executors);

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

totalSales(readers, 3)
  .then((total) => console.log(total))
  .catch((error) => console.error(error));

// Async output:
// 500600150.46