import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

// IMPORTANT: el parámetro ES "product", NO "id"
const productId = getParam("product");
console.log("🔎 productId recibido:", productId);

const dataSource = new ProductData();
const product = new ProductDetails(productId, dataSource);
product.init();





