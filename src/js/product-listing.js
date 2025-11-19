import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

// Get category from URL
const category = getParam("category");

// 🏷️ Update page title
const titleElement = document.querySelector(".product-list-title");
if (titleElement && category) {
  titleElement.textContent = `Top Products: ${category}`;
}

const dataSource = new ExternalServices();

// Get list element
const listElement = document.querySelector(".product-list");

// Create ProductList instance
const productList = new ProductList(category, dataSource, listElement);

// Load products
productList.init();



