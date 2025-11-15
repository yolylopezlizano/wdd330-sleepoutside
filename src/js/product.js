import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// Cargar header/footer
loadHeaderFooter();

// Obtener ID del producto desde la URL
const productId = getParam("product");
console.log("🔎 productId recibido:", productId);

// Crear datasource SIN categoría
const dataSource = new ProductData();

// Crear clase de detalle
const product = new ProductDetails(productId, dataSource);
product.init();





