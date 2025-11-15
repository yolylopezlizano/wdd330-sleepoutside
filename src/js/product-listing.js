import { loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

console.log("📄 product-listing.js cargado");

loadHeaderFooter();

const category = new URLSearchParams(window.location.search).get("category") || "tents";

console.log("📌 Category from URL:", category);

const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");

const productList = new ProductList(category, dataSource, listElement);
productList.init();


