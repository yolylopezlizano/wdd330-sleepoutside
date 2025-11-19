import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

// IMPORTANT: el parámetro ES "product", NO "id"
const productId = getParam("product");
console.log("🔎 productId recibido:", productId);

const dataSource = new ExternalServices();
const product = new ProductDetails(productId, dataSource);
product.init();





