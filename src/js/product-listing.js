// product-listing.js
import ProductData from "./ProductData.mjs";
import ProductList from "../ProductList.mjs";

console.log("📄 product-listing.js cargado");

const dataSource = new ProductData("tents");
const listElement = document.querySelector(".product-list");

const productList = new ProductList("tents", dataSource, listElement);
productList.init();


