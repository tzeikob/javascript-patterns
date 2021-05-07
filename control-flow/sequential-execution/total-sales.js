import api from 'api';

function getProduct (code) {
  return api.products.find({ code });
}

function getProductSales (product) {
  return api.sales.find({ productId: product.id });
}

function saveProductSales (product, total) {
  return api.analytics.sales.save({ productId: product.id, total });
}

async function productSales (code) {
  if (!code || typeof code !== "string") {
    throw new Error("Invalid code argument");
  }

  let product = await getProduct(code);
  total = await getProductSales(product);
  const result = await saveProductSales(product, total);

  return result;
}

productSales('PRD.332')
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });

// Async output:
// { productId: 145, total: 455.89 }